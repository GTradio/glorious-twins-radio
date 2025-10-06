import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const limit = searchParams.get("limit");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const where: any = {};
		if (status) where.status = status;

		const messages = await prisma.contactMessage.findMany({
			where,
			orderBy: { createdAt: "desc" },
			take: limit ? parseInt(limit) : undefined,
		});

		return NextResponse.json(messages);
	} catch (error) {
		console.error("Error fetching contact messages:", error);
		return NextResponse.json(
			{ error: "Failed to fetch contact messages" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const message = await prisma.contactMessage.create({
			data: {
				name: body.name,
				email: body.email,
				phone: body.phone,
				subject: body.subject,
				message: body.message,
				metadata: body.metadata,
			},
		});

		// You can add email notification logic here
		// await sendEmailNotification(message);

		return NextResponse.json(message, { status: 201 });
	} catch (error) {
		console.error("Error creating contact message:", error);
		return NextResponse.json(
			{ error: "Failed to send message" },
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
				{ error: "Message ID is required" },
				{ status: 400 }
			);
		}

		const message = await prisma.contactMessage.update({
			where: { id },
			data,
		});

		return NextResponse.json(message);
	} catch (error) {
		console.error("Error updating contact message:", error);
		return NextResponse.json(
			{ error: "Failed to update message" },
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
				{ error: "Message ID is required" },
				{ status: 400 }
			);
		}

		await prisma.contactMessage.delete({
			where: { id },
		});

		return NextResponse.json({
			message: "Contact message deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting contact message:", error);
		return NextResponse.json(
			{ error: "Failed to delete message" },
			{ status: 500 }
		);
	}
}
