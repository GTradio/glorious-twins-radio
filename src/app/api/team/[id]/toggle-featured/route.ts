import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;

		// First get the current team member
		const currentTeamMember = await prisma.team.findUnique({
			where: { id },
			select: { featured: true },
		});

		if (!currentTeamMember) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		// Toggle the featured status
		const updatedTeamMember = await prisma.team.update({
			where: { id },
			data: {
				featured: !currentTeamMember.featured,
			},
		});

		return NextResponse.json(updatedTeamMember);
	} catch (error) {
		console.error("Error toggling featured status:", error);
		return NextResponse.json(
			{ error: "Failed to toggle featured status" },
			{ status: 500 }
		);
	}
}
