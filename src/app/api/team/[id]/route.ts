import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;

		const teamMember = await prisma.team.findUnique({
			where: { id },
		});

		if (!teamMember) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(teamMember);
	} catch (error) {
		console.error("Error fetching team member:", error);
		return NextResponse.json(
			{ error: "Failed to fetch team member" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;
		const body = await request.json();

		const {
			name,
			role,
			roleYoruba,
			imageUrl,
			description,
			email,
			phone,
			bio,
			socialLinks,
			featured,
			active,
			displayOrder,
		} = body;

		const teamMember = await prisma.team.update({
			where: { id },
			data: {
				...(name && { name }),
				...(role && { role }),
				...(roleYoruba !== undefined && { roleYoruba }),
				...(imageUrl && { imageUrl }),
				...(description && { description }),
				...(email !== undefined && { email }),
				...(phone !== undefined && { phone }),
				...(bio !== undefined && { bio }),
				...(socialLinks !== undefined && { socialLinks }),
				...(featured !== undefined && { featured }),
				...(active !== undefined && { active }),
				...(displayOrder !== undefined && { displayOrder }),
			},
		});

		return NextResponse.json(teamMember);
	} catch (error) {
		console.error("Error updating team member:", error);
		if (
			error instanceof Error &&
			error.message.includes("Record to update not found")
		) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ error: "Failed to update team member" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;

		await prisma.team.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Team member deleted successfully" });
	} catch (error) {
		console.error("Error deleting team member:", error);
		if (
			error instanceof Error &&
			error.message.includes("Record to delete does not exist")
		) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ error: "Failed to delete team member" },
			{ status: 500 }
		);
	}
}
