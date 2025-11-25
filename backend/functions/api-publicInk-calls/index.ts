import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as publicInk from './publicInk';
import { notAllowedResponse, clientErrorResponse } from '../shared/utils';

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<any> => {
  const httpMethod = event.requestContext.http.method;
  const routeKey = event.routeKey.split(' ')[1];
  const pathParameters = event.pathParameters;

  if (httpMethod === 'GET' && routeKey === '/publicInk') {
    return publicInk.listPublicInks();
  }

  if (httpMethod === 'GET' && routeKey === '/publicInk/{id}') {
    if (!pathParameters?.id) {
      return clientErrorResponse('Missing required parameter');
    }
    return publicInk.getPublicInk(pathParameters.id);
  }
  return notAllowedResponse();
};
