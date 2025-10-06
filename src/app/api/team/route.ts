import { prisma } from "@/lib/prisma"; // Adjust import path based on your setup
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search");
		const featured = searchParams.get("featured");
		const active = searchParams.get("active");
		const take = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!)
			: 50;
		const skip = searchParams.get("offset")
			? parseInt(searchParams.get("offset")!)
			: 0;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const where: any = {};

		// Filter by active status (default to true if not specified)
		if (active !== null) {
			where.active = active === "true";
		} else {
			where.active = true; // Default to active members only
		}

		// Filter by featured status
		if (featured === "true") {
			where.featured = true;
		}

		// Add search functionality
		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ role: { contains: search, mode: "insensitive" } },
				{ roleYoruba: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
				{ bio: { contains: search, mode: "insensitive" } },
			];
		}

		const [teamMembers, total] = await Promise.all([
			prisma.team.findMany({
				where,
				orderBy: [
					{ featured: "desc" }, // Featured members first
					{ displayOrder: "asc" }, // Then by display order
					{ createdAt: "desc" }, // Then by creation date
				],
				take,
				skip,
			}),
			prisma.team.count({ where }),
		]);

		return NextResponse.json({
			teamMembers,
			total,
			hasMore: skip + take < total,
		});
	} catch (error) {
		console.error("Error fetching team members:", error);
		return NextResponse.json(
			{ error: "Failed to fetch team members" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
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
			featured = false,
			active = true,
			displayOrder = 0,
		} = body;

		// Validate required fields
		if (!name || !role || !imageUrl || !description) {
			return NextResponse.json(
				{ error: "Name, role, imageUrl, and description are required" },
				{ status: 400 }
			);
		}

		const teamMember = await prisma.team.create({
			data: {
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
			},
		});

		return NextResponse.json(teamMember, { status: 201 });
	} catch (error) {
		console.error("Error creating team member:", error);
		return NextResponse.json(
			{ error: "Failed to create team member" },
			{ status: 500 }
		);
	}
}
