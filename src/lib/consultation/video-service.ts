import { ParticipantRole } from "@/types/models/consultation";

export interface VideoRoomResponse {
  roomUrl: string;
  roomName: string;
  token: string;
  isDemoMode: boolean;
  expiresAt: string;
}

export class VideoService {
  private static DAILY_API_URL = "https://api.daily.co/v1";

  static async getOrCreateConsultationRoom(consultationId: string): Promise<string> {
    const apiKey = process.env.DAILY_API_KEY;
    const roomName = `care360-${consultationId}`.toLowerCase().replace(/[^a-z0-9_-]/g, "");

    if (!apiKey) {
      // Demo Room Mode
      return `https://care360.daily.co/${roomName}`;
    }

    try {
      // Check or create room idempotently
      const res = await fetch(`${this.DAILY_API_URL}/rooms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName,
          privacy: "private",
          properties: {
            enable_screenshare: true,
            enable_chat: false,
            exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.url;
      }

      // If room already exists, fetch room details
      const existingRes = await fetch(`${this.DAILY_API_URL}/rooms/${roomName}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (existingRes.ok) {
        const existingData = await existingRes.json();
        return existingData.url;
      }
    } catch (error) {
      console.warn("Daily API room creation encountered an issue, falling back to secure demo endpoint:", error);
    }

    return `https://care360.daily.co/${roomName}`;
  }

  static async getVideoToken(
    consultationId: string,
    userId: string,
    role: ParticipantRole,
    userName: string
  ): Promise<VideoRoomResponse> {
    const apiKey = process.env.DAILY_API_KEY;
    const roomName = `care360-${consultationId}`.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const roomUrl = await this.getOrCreateConsultationRoom(consultationId);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour validity

    if (!apiKey) {
      return {
        roomUrl,
        roomName,
        token: `care360_demo_token_${role}_${userId}_${Date.now()}`,
        isDemoMode: true,
        expiresAt,
      };
    }

    try {
      const res = await fetch(`${this.DAILY_API_URL}/meeting-tokens`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            is_owner: role === "doctor",
            user_name: userName,
            user_id: userId,
            enable_screenshare: true,
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          roomUrl,
          roomName,
          token: data.token,
          isDemoMode: false,
          expiresAt,
        };
      }
    } catch (err) {
      console.warn("Daily token generation failed, switching to demo mode:", err);
    }

    return {
      roomUrl,
      roomName,
      token: `care360_demo_token_${role}_${userId}_${Date.now()}`,
      isDemoMode: true,
      expiresAt,
    };
  }
}
