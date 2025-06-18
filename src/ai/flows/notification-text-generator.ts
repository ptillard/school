'use server';

/**
 * @fileOverview A notification text generation AI agent.
 *
 * - generateNotificationText - A function that handles the notification text generation process.
 * - GenerateNotificationTextInput - The input type for the generateNotificationText function.
 * - GenerateNotificationTextOutput - The return type for the generateNotificationText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNotificationTextInputSchema = z.object({
  eventTitle: z.string().describe('The title of the event.'),
  eventDescription: z.string().describe('The description of the event.'),
  eventType: z.string().describe('The type of the event (e.g., exam, homework, announcement).'),
  courseName: z.string().describe('The name of the course the event is related to.'),
  schoolName: z.string().describe('The name of the school.'),
});
export type GenerateNotificationTextInput = z.infer<typeof GenerateNotificationTextInputSchema>;

const GenerateNotificationTextOutputSchema = z.object({
  notificationText: z.string().describe('The generated notification text for the event.'),
});
export type GenerateNotificationTextOutput = z.infer<typeof GenerateNotificationTextOutputSchema>;

export async function generateNotificationText(
  input: GenerateNotificationTextInput
): Promise<GenerateNotificationTextOutput> {
  return generateNotificationTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNotificationTextPrompt',
  input: {schema: GenerateNotificationTextInputSchema},
  output: {schema: GenerateNotificationTextOutputSchema},
  prompt: `You are an AI assistant specialized in generating notification text for school events.

  Given the following event details, generate a concise and informative notification text suitable for sending to parents.
  The notification should include essential information about the event, such as its type, title, and any relevant details. Make it as short as possible. Always include the course name and school name.

  Event Title: {{{eventTitle}}}
  Event Description: {{{eventDescription}}}
  Event Type: {{{eventType}}}
  Course Name: {{{courseName}}}
  School Name: {{{schoolName}}}
  \nNotification Text:`,
});

const generateNotificationTextFlow = ai.defineFlow(
  {
    name: 'generateNotificationTextFlow',
    inputSchema: GenerateNotificationTextInputSchema,
    outputSchema: GenerateNotificationTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
