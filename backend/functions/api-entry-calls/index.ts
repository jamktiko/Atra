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

  // List all user's entries
  if (httpMethod === 'GET' && routeKey === '/entry') {
    return entry.listEntries(userId);
  }

  // Get specific entry
  if (httpMethod === 'GET' && routeKey === '/entry/{id}') {
    if (!pathParameters?.id) return clientErrorResponse('Missing id');
    return entry.getEntry(pathParameters.id, userId);
  }

  // Create new entry
  if (httpMethod === 'POST' && routeKey === '/entry') {
    if (!event.body) return clientErrorResponse('Missing request body');
    const { customer_id, entry_date, comments, user_ink_id } = JSON.parse(
      event.body
    );

    // Validation
    if (!entry_date || !Array.isArray(user_ink_id)) {
      return clientErrorResponse('Missing required fields');
    }

    // Create entry
    return entry.addEntry(
      userId,
      customer_id ?? null,
      entry_date,
      user_ink_id,
      comments ?? null
    );
  }

  // Update entry
  if (httpMethod === 'PUT' && routeKey === '/entry/{id}') {
    if (!pathParameters?.id) return clientErrorResponse('Missing id');
    if (!event.body) return clientErrorResponse('Missing request body');

    const { entry_date, comments, customer_id, replace_user_ink_id } =
      JSON.parse(event.body);
    /*
    // Parse body and extract fields to update
    const {
      entry_date,
      comments,
      customer_id,
      add_user_ink_id,
      remove_user_ink_id,
    } = JSON.parse(event.body);
     */

    // Validation
    if (
      entry_date === undefined &&
      comments === undefined &&
      customer_id === undefined &&
      !Array.isArray(replace_user_ink_id)
      //!Array.isArray(add_user_ink_id) &&
      //!Array.isArray(remove_user_ink_id)
    ) {
      return clientErrorResponse('No fields to update');
    }

    // Update entry
    return entry.updateEntry(
      Number(pathParameters.id),
      userId,
      entry_date,
      comments,
      customer_id,
      replace_user_ink_id
      //add_user_ink_id,
      //remove_user_ink_id
    );
  }

  // Delete entry
  if (httpMethod === 'DELETE' && routeKey === '/entry/{id}') {
    if (!pathParameters?.id) return clientErrorResponse('Missing id');
    return entry.deleteEntry(Number(pathParameters.id), userId);
  }

  return notAllowedResponse();
};
