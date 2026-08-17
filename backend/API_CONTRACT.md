openapi: 3.0.0
info:
  title: Drug Inventory Management API
  description: API for managing drug inventory, procurement, warehousing, and consumption.
  version: 1.0.0
servers:
  - url: http://localhost:3000/api
    description: Local development server
paths:
  /auth/login:
    post:
      summary: User login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  refresh_token:
                    type: string
                  user:
                    type: object
  /drugs:
    get:
      summary: Get all drugs
      responses:
        '200':
          description: A list of drugs
  /drugs/{id}:
    get:
      summary: Get a drug by ID
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Drug details
  /purchase-orders:
    get:
      summary: List purchase orders
      responses:
        '200':
          description: A list of purchase orders
    post:
      summary: Create a purchase order
      responses:
        '201':
          description: Purchase order created
  /warehouse/grn:
    post:
      summary: Create a Goods Receipt Note (GRN)
      responses:
        '201':
          description: GRN created
  /shipments:
    post:
      summary: Create a shipment
      responses:
        '201':
          description: Shipment created
  /consumption/log:
    post:
      summary: Log drug consumption
      responses:
        '201':
          description: Consumption logged
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
