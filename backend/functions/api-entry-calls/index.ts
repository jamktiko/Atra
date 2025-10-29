import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import * as entry from './entry';
import { clientErrorResponse, notAllowedResponse } from '../shared/utils';

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
): Promise<any> => {
  const httpMethod = event.requestContext.http.method;
  const routeKey = event.routeKey.split(' ')[1];
  const pathParameters = event.pathParameters;
  //const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  const userId = process.env.DEMO_USER_ID || 'demo-user-123';

  if (httpMethod === 'GET' && routeKey === '/entry') {
    return entry.listEntries(userId);
  }

  if (httpMethod === 'GET' && routeKey === '/entry/{id}') {
    if (!pathParameters?.id) return clientErrorResponse('Missing id');
    return entry.getEntry(pathParameters.id, userId);
  }

  if (httpMethod === 'POST' && routeKey === '/entry') {
    if (!event.body) return clientErrorResponse('Missing request body');
    const { customer_id, entry_date, comments, user_ink_id } = JSON.parse(
      event.body
    );

    if (!customer_id || !entry_date || !Array.isArray(user_ink_id)) {
      return clientErrorResponse('Missing required fields');
    }

    return entry.addEntry(
      userId,
      customer_id,
      entry_date,
      user_ink_id,
      comments || ''
    );
  }

  if (httpMethod === 'PUT' && routeKey === '/entry/{id}') {
    if (!pathParameters?.id) return clientErrorResponse('Missing id');
    if (!event.body) return clientErrorResponse('Missing request body');

    const fields = JSON.parse(event.body);
    return entry.updateEntry(Number(pathParameters.id), userId, fields);
  }

  if (httpMethod === 'DELETE' && routeKey === '/entry/{id}') {
    if (!pathParameters?.id) return clientErrorResponse('Missing id');
    return entry.deleteEntry(Number(pathParameters.id), userId);
  }

  return notAllowedResponse();
};
