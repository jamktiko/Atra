//import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import * as user from './user';
import { notAllowedResponse, clientErrorResponse } from '../shared/utils';

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
    event
): Promise<any> => {
    const httpMethod = event.requestContext.http.method;
    const routeKey = event.routeKey.split(' ')[1];
    const pathParameters = event.pathParameters;
    const userId = event.requestContext.authorizer.jwt.claims.sub as string;

    if (httpMethod === 'GET' && routeKey === '/user') {
        return user.listUsers();
    }

    //if (httpMethod === 'GET' && routeKey === '/user/{id}') {
    //  if (!pathParameters?.id) {
    //    return clientErrorResponse('Missing required parameter');
    //  }
    //  return user.getUser(pathParameters.id);
    //}

    // Get one user's own info (first_name)
    if (httpMethod === 'GET' && routeKey === '/user/me') {
        return user.getUser(userId);
    }

    return notAllowedResponse();
}