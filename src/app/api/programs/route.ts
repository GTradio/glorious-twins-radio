import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const day = searchParams.get("day");
		const featured = searchParams.get("featured");
		const search = searchParams.get("search");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const where: any = {};

		if (day) where.day = day;
		if (featured === "true") where.featured = true;

		// Add search functionality
		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
				{ host: { contains: search, mode: "insensitive" } },
			];
		}

		const programs = await prisma.program.findMany({
			where,
			orderBy: [{ day: "asc" }, { startTime: "asc" }],
		});

		return NextResponse.json(programs);
	} catch (error) {
		console.error("Error fetching programs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch programs" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const program = await prisma.program.create({
			data: {
				name: body.name,
				host: body.host,
				day: body.day,
				startTime: body.startTime,
				endTime: body.endTime,
				description: body.description,
				imageUrl: body.imageUrl,
				featured: body.featured || false,
				active: body.active !== false,
			},
		});

		return NextResponse.json(program, { status: 201 });
	} catch (error) {
		console.error("Error creating program:", error);
		return NextResponse.json(
			{ error: "Failed to create program" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { id, ...data } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Program ID is required" },
				{ status: 400 }
			);
		}

		const program = await prisma.program.update({
			where: { id },
			data,
		});

		return NextResponse.json(program);
	} catch (error) {
		console.error("Error updating program:", error);
		return NextResponse.json(
			{ error: "Failed to update program" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Program ID is required" },
				{ status: 400 }
			);
		}

		await prisma.program.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Program deleted successfully" });
	} catch (error) {
		console.error("Error deleting program:", error);
		return NextResponse.json(
			{ error: "Failed to delete program" },
			{ status: 500 }
		);
	}
}
