import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import * as userInk from './userInk';
import { clientErrorResponse, notAllowedResponse } from '../shared/utils';

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
): Promise<any> => {
  const httpMethod = event.requestContext.http.method;
  const routeKey = event.routeKey.split(' ')[1];
  const pathParameters = event.pathParameters;
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  //const userId = process.env.DEMO_USER_ID || 'demo-user-123';

  if (httpMethod === 'GET' && routeKey === '/userInk') {
    return userInk.listOwnInks(userId);
  }

  if (httpMethod === 'GET' && routeKey === '/userInk/{id}') {
    if (!pathParameters?.id) return clientErrorResponse('Missing id');
    return userInk.getUserInk(pathParameters.id, userId);
  }

  if (httpMethod === 'POST' && routeKey === '/userInk') {
    return userInk.addUserInk(userId, JSON.parse(event.body || '{}'));
  }

  if (httpMethod === 'DELETE' && routeKey === '/userInk/{id}') {
    return userInk.deleteUserInk(pathParameters!.id!, userId!);
  }

  if (httpMethod === 'PUT' && routeKey === '/userInk/{id}') {
    return userInk.updateUserInk(pathParameters!.id!, userId!, event.body!);
  }

  return notAllowedResponse();
};
