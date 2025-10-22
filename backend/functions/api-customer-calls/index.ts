// tiedosto joka hoitaa reitityksen eri API-kutsuille
// handleri funktio tarkistaa HTTP metodin ja reitittää kutsun oikeaan käsittelijään
// handleria kutsutaan API GW:n kautta

import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import * as customer from './customer';
import { notAllowedResponse } from '../shared/utils';

// reititetään kutsut oikeisiin käsittelijöihin
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
): Promise<any> => {
  const httpMethod = event.requestContext.http.method;
  // routeKey on muotoa "GET /customer" ym.
  const routeKey = event.routeKey.split(' ')[1];
  const pathParameters = event.pathParameters;
  // käyttäjän ID löytyy JWT tokenista, sub on käyttäjän uniikki tunniste Cognitossa
  //const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  const userId = process.env.DEMO_USER_ID || 'demo-user-123';

  if (httpMethod === 'GET' && routeKey === '/customer') {
    return customer.listCustomers(userId);
  }

  if (httpMethod === 'GET' && routeKey === '/customer/{id}') {
    return customer.getCustomer(pathParameters!.id!);
  }

  if (httpMethod === 'PUT' && routeKey === '/customer/{id}') {
    return customer.updateCustomer(pathParameters!.id!, event.body!);
  }

  if (httpMethod === 'DELETE' && routeKey === '/customer/{id}') {
    return customer.deleteCustomer(pathParameters!.id!);
  }

  if (httpMethod === 'POST' && routeKey === '/customer') {
    return customer.addCustomer(userId, event.body!);
  }
  return notAllowedResponse();

  /* lisää reitityksiä */
};
