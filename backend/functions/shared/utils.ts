// utils.ts has common reponse functions

export function successResponse(body: any = {}, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export function clientErrorResponse(message = 'Bad Request', statusCode = 400) {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export function notFoundResponse(message = 'Not Found') {
  return {
    statusCode: 404,
    body: JSON.stringify({ error: message }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export function notAllowedResponse(message = 'Method Not Allowed') {
  return {
    statusCode: 405,
    body: JSON.stringify({ error: message }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
