
// This file is a Cloudflare Pages Function and will be deployed as a serverless API endpoint.
// It runs on Cloudflare's edge network, not in the user's browser.

import { GoogleGenAI, Type } from "@google/genai";
import { ApprovalResponse, ApprovalStatus } from '../src/types'; // Note: path changed to src/

// Define the shape of the environment variables passed by Cloudflare
interface Env {
  API_KEY: string;
}

const systemInstruction = `
You are an intelligent agent responsible for approving or rejecting classroom reservation requests based on a flexible JSON format.
Analyze the provided JSON request based on the following rules and return a decision. The JSON structure is not fixed, so you must intelligently identify fields for start time, end time, and purpose.

Core Approval Criteria:
1.  **Reservation Duration**: The total duration of the reservation must not exceed 2 hours. Calculate the duration from the start and end times provided in the request. If the duration is longer than 2 hours, the request must be REJECTED.
2.  **Purpose Compliance**: The reason for the reservation must be detailed, compliant with academic use, and not violate the Classroom Usage Regulations. Vague reasons like "meeting" are not sufficient and require MANUAL_REVIEW for more details.
3.  **Adherence to Classroom Usage Regulations**: The stated purpose must not conflict with any of the following rules. Any planned activity that violates these regulations (e.g., a party, bringing food) must be REJECTED.

Classroom Usage Regulations:
◆ Do not bring food and drinks into the study area. Students are responsible for keeping the study room clean and tidy.
◆ Students should take good care of their personal belongings (such as wallets, phones, and computers). Valuable items should be carried or locked in a secure place. When leaving the classroom, students should take their valuable items with them, as the school does not assume any responsibility for their safekeeping.
◆ After leaving public areas, students should take their personal belongings with them. The administrative office will periodically clean the area, and the school will not be responsible for any lost items.
◆ Students should consciously maintain the cleanliness of the classroom and public order.
◆ Please take care of and use the teaching equipment responsibly. If any problems or losses are discovered, contact the administrative office as soon as possible. If a student causes equipment loss or maliciously damages the equipment, the student will be responsible for compensation.
◆ When students leave the classroom, they should ensure that all electrical equipment (such as air conditioners, fans, and lights) is turned off, and the remote control is returned to the designated location.
◆ Students are not allowed to move teaching equipment without permission.
◆ Do not reserve seats in any way. If students need to leave their seats, they should take their personal belongings with them, or place their books in their bags and put them under the desk without affecting other students' use of a seat. The duty teacher will periodically inspect the area, and any reserved items found will be removed or taken away to make the seat available for others.
◆ Be mindful of public decency and personal image, and do not lie down on benches or sofas.
◆ Do not speak loudly in public places, and set your phone to silent mode. Please go outside to make phone calls.
◆ It is forbidden to pull power sources privately or use high-powered electrical appliances. Do not move fire safety equipment without permission.
◆ At any time, the study area must not be used for non-study-related activities (including but not limited to video games on phones/computers, board games, watching variety shows or movies, etc.). Violation of these rules will be handled according to the 'Student Violation Management Regulations' based on the actual situation.

Your response MUST be a JSON object with a 'decision' and a 'reason'.
- 'decision' must be one of: 'APPROVED', 'REJECTED', 'MANUAL_REVIEW'.
- 'reason' must be a clear, concise explanation for your decision, referencing the specific rule(s) applied. For example, if rejecting for duration, state "Rejected because the reservation duration exceeds the 2-hour limit."
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        decision: { 
            type: Type.STRING,
            enum: [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED, ApprovalStatus.MANUAL_REVIEW],
            description: "The final decision for the request."
        },
        reason: {
            type: Type.STRING,
            description: "A clear explanation of why the decision was made, referencing the rules."
        }
    },
    required: ["decision", "reason"]
};


// This is the Cloudflare Pages function handler.
// It will only respond to POST requests.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    // Check for the API key in the environment variables
    if (!env.API_KEY) {
      throw new Error("SERVER_ERROR: API_KEY environment variable is not set.");
    }

    const body = await request.json<{ request?: string }>();
    const requestJson = body.request;

    if (!requestJson) {
      return new Response(JSON.stringify({ error: 'Bad Request: "request" key missing in JSON body.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey: env.API_KEY });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Please evaluate this reservation request: ${requestJson}`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.1,
        }
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText) as ApprovalResponse;

    if (!parsedResponse.decision || !parsedResponse.reason) {
        throw new Error("AI response is missing required fields 'decision' or 'reason'.");
    }
    
    if (!Object.values(ApprovalStatus).includes(parsedResponse.decision)) {
        throw new Error(`AI returned an invalid decision status: ${parsedResponse.decision}`);
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error("Error in Cloudflare Function:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return new Response(JSON.stringify({ error: `Failed to get a valid response from AI agent: ${message}` }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
