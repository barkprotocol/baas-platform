import { ACTIONS_CORS_HEADERS, ActionsJson } from '@solana/actions';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define a schema for rule validation
const RuleSchema = z.object({
  id: z.string().optional(),
  pathPattern: z.string(),
  apiPath: z.string(),
});

const ActionsJsonSchema = z.object({
  rules: z.array(RuleSchema),
});

// In-memory store for rules (replace with database in production)
let rules: ActionsJson['rules'] = [
  {
    pathPattern: '/*',
    apiPath: '/api/v1/actions/*',
  },
  {
    pathPattern: '/api/v1/actions/**',
    apiPath: '/api/v1/actions/**',
  },
];

export const GET = async (req: NextRequest) => {
  const payload: ActionsJson = { rules };

  return NextResponse.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = async (req: NextRequest) => {
  return new NextResponse(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const newRule = RuleSchema.parse(body);
    
    newRule.id = crypto.randomUUID(); // Generate a unique ID for the new rule
    rules.push(newRule);

    return NextResponse.json({ message: 'Rule added successfully', rule: newRule }, {
      status: 201,
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
    return NextResponse.json({ error: 'Internal server error' }, {
      status: 500,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const updatedRule = RuleSchema.parse(body);
    
    const index = rules.findIndex(rule => rule.id === updatedRule.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Rule not found' }, {
        status: 404,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    rules[index] = updatedRule;

    return NextResponse.json({ message: 'Rule updated successfully', rule: updatedRule }, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
    return NextResponse.json({ error: 'Internal server error' }, {
      status: 500,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const ruleId = searchParams.get('id');

  if (!ruleId) {
    return NextResponse.json({ error: 'Rule ID is required' }, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const initialLength = rules.length;
  rules = rules.filter(rule => rule.id !== ruleId);

  if (rules.length === initialLength) {
    return NextResponse.json({ error: 'Rule not found' }, {
      status: 404,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  return NextResponse.json({ message: 'Rule deleted successfully' }, {
    headers: ACTIONS_CORS_HEADERS,
  });
};