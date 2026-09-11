import { NextResponse } from "next/server";
import { corsairClient, CORSAIR_MCP_TOOLS } from "@/lib/corsair/corsair-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      protocol: "Model Context Protocol (MCP) v1.0",
      host: "Corsair HealthOps Clinical Layer",
      toolsCount: CORSAIR_MCP_TOOLS.length,
      tools: CORSAIR_MCP_TOOLS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to list Corsair MCP tools" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolName, parameters, confirmedByHuman = true } = body;

    if (!toolName) {
      return NextResponse.json(
        { error: "Tool name is required for Corsair MCP execution" },
        { status: 400 }
      );
    }

    const tool = CORSAIR_MCP_TOOLS.find((t) => t.name === toolName);
    if (!tool) {
      return NextResponse.json(
        { error: `Tool '${toolName}' not found in Corsair MCP registry` },
        { status: 404 }
      );
    }

    // Human-in-the-loop security check
    if (tool.permissionRequired === "human_approval" && !confirmedByHuman) {
      return NextResponse.json({
        success: false,
        requiresApproval: true,
        message: `Tool '${toolName}' modifies external systems (GitHub/Slack) and requires human authorization.`,
      });
    }

    const result = await corsairClient.executeMCPTool(toolName, parameters || {});

    return NextResponse.json({
      ...result,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("[API /api/corsair/mcp] Error:", error);
    return NextResponse.json(
      { error: "MCP tool execution failed" },
      { status: 500 }
    );
  }
}
