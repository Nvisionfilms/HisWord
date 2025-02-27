import { NextResponse } from 'next/server';
import { getVersesForEmotion } from '@/lib/openai';
import { verseCache } from '@/lib/cache';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage.content;

    // Extract emotion from user input
    const emotion = userInput.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(' ')
      .filter((word: string) => word.length > 2)
      .join(' ');

    // Get relevant verses
    const { verses, source } = await getVersesForEmotion(emotion);

    // Format response
    let response = '';
    if (verses && verses.length > 0) {
      response = `Here are some verses that may help with your feelings:\n\n`;
      verses.forEach((verse: any) => {
        response += `${verse.text || verse.verse}\n- ${verse.reference}\n\n`;
      });
      response += `Remember, God's word is a source of comfort and guidance. Take time to meditate on these verses.`;
    } else {
      response = `I couldn't find specific verses for your feelings, but remember that God is always with you. Try expressing your feelings in a different way, or try some common emotions like "peace", "hope", or "comfort".`;
    }

    return NextResponse.json({
      response,
      verses,
      source
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
