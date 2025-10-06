import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const search = searchParams.get("search");

		// If ID is provided, fetch single news item
		if (id) {
			const news = await prisma.news.findUnique({
				where: { id },
			});

			if (!news) {
				return NextResponse.json({ error: "News not found" }, { status: 404 });
			}

			return NextResponse.json(news);
		}

		// Otherwise, fetch multiple news items (existing logic)
		const take = searchParams.get("limit")
			? parseInt(searchParams.get("limit")!)
			: 10;
		const skip = searchParams.get("offset")
			? parseInt(searchParams.get("offset")!)
			: 0;
		const category = searchParams.get("category");
		const featured = searchParams.get("featured");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const where: any = { published: true };

		if (category) where.category = category;
		if (featured === "true") where.featured = true;

		// Add search functionality
		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ content: { contains: search, mode: "insensitive" } },
			];
		}

		const [news, total] = await Promise.all([
			prisma.news.findMany({
				where,
				orderBy: { publishDate: "desc" },
				take,
				skip,
			}),
			prisma.news.count({ where }),
		]);

		return NextResponse.json({
			news,
			total,
			hasMore: skip + take < total,
		});
	} catch (error) {
		console.error("Error fetching news:", error);
		return NextResponse.json(
			{ error: "Failed to fetch news" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const news = await prisma.news.create({
			data: {
				title: body.title,
				description: body.description,
				content: body.content,
				imageUrl: body.imageUrl,
				category: body.category,
				author: body.author,
				featured: body.featured || false,
				published: body.published !== false,
				publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
			},
		});

		return NextResponse.json(news, { status: 201 });
	} catch (error) {
		console.error("Error creating news:", error);
		return NextResponse.json(
			{ error: "Failed to create news" },
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
				{ error: "News ID is required" },
				{ status: 400 }
			);
		}

		const news = await prisma.news.update({
			where: { id },
			data: {
				...data,
				publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
			},
		});

		return NextResponse.json(news);
	} catch (error) {
		console.error("Error updating news:", error);
		return NextResponse.json(
			{ error: "Failed to update news" },
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
				{ error: "News ID is required" },
				{ status: 400 }
			);
		}

		await prisma.news.delete({
			where: { id },
		});

		return NextResponse.json({ message: "News deleted successfully" });
	} catch (error) {
		console.error("Error deleting news:", error);
		return NextResponse.json(
			{ error: "Failed to delete news" },
			{ status: 500 }
		);
	}
}
