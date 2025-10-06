import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search");
		const take = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!)
			: 10;
		const skip = searchParams.get("offset")
			? parseInt(searchParams.get("offset")!)
			: 0;
		const featured = searchParams.get("featured");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const where: any = { published: true };

		if (featured === "true") where.featured = true;

		// Add search functionality
		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		const [podcasts, total] = await Promise.all([
			prisma.podcast.findMany({
				where,
				orderBy: { publishDate: "desc" },
				take,
				skip,
			}),
			prisma.podcast.count({ where }),
		]);

		return NextResponse.json({
			podcasts,
			total,
			hasMore: skip + take < total,
		});
	} catch (error) {
		console.error("Error fetching podcasts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch podcasts" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const podcast = await prisma.podcast.create({
			data: {
				title: body.title,
				description: body.description,
				content: body.content,
				imageUrl: body.imageUrl,
				audioUrl: body.audioUrl,
				duration: body.duration,
				episodeNumber: body.episodeNumber,
				season: body.season,
				featured: body.featured || false,
				published: body.published !== false,
				publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
			},
		});

		return NextResponse.json(podcast, { status: 201 });
	} catch (error) {
		console.error("Error creating podcast:", error);
		return NextResponse.json(
			{ error: "Failed to create podcast" },
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
				{ error: "Podcast ID is required" },
				{ status: 400 }
			);
		}

		const podcast = await prisma.podcast.update({
			where: { id },
			data: {
				...data,
				publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
			},
		});

		return NextResponse.json(podcast);
	} catch (error) {
		console.error("Error updating podcast:", error);
		return NextResponse.json(
			{ error: "Failed to update podcast" },
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
				{ error: "Podcast ID is required" },
				{ status: 400 }
			);
		}

		await prisma.podcast.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Podcast deleted successfully" });
	} catch (error) {
		console.error("Error deleting podcast:", error);
		return NextResponse.json(
			{ error: "Failed to delete podcast" },
			{ status: 500 }
		);
	}
}
