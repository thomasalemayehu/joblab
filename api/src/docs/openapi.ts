type OpenApiOptions = {
  version: string;
  serverUrl: string;
};

export const createOpenApiSpec = ({ version, serverUrl }: OpenApiOptions) => {
  return {
    openapi: "3.0.3",
    info: {
      title: "JobLab API",
      version,
      description:
        "JobLab is a lightweight backend service that accepts jobs, processes them, and tracks their status.",
    },
    servers: [{ url: serverUrl }],
    tags: [
      { name: "Health", description: "Service health checks" },
      { name: "Jobs", description: "Job submission and status" },
    ],
    paths: {
      "/v1/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          description: "Returns whether the service is healthy.",
          operationId: "getHealth",
          responses: {
            "200": {
              description: "Service is healthy.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                },
              },
            },
            "500": { $ref: "#/components/responses/ServerError" },
          },
        },
      },
      "/v1/health/fail": {
        get: {
          tags: ["Health"],
          summary: "Fail the app (test endpoint)",
          description: "Forces the service to throw an error.",
          operationId: "failApp",
          responses: {
            "500": { $ref: "#/components/responses/ServerError" },
          },
        },
      },
      "/v1/jobs": {
        get: {
          tags: ["Jobs"],
          summary: "List jobs",
          description: "Returns all jobs.",
          operationId: "listJobs",
          parameters: [
            {
              name: "page",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 1, default: 1 },
              description: "Page number (1-based).",
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 1, default: 10 },
              description: "Page size.",
            },
          ],
          responses: {
            "200": {
              description: "List of jobs.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobListResponse" },
                },
              },
            },
            "500": { $ref: "#/components/responses/ServerError" },
          },
        },
      },
      "/v1/jobs/{id}": {
        get: {
          tags: ["Jobs"],
          summary: "Get job by ID",
          description: "Returns a single job by ID.",
          operationId: "getJobById",
          parameters: [{ $ref: "#/components/parameters/JobId" }],
          responses: {
            "200": {
              description: "Job details.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobResponse" },
                },
              },
            },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/ServerError" },
          },
        },
        delete: {
          tags: ["Jobs"],
          summary: "Delete job by ID",
          description: "Deletes a job by ID.",
          operationId: "deleteJobById",
          parameters: [{ $ref: "#/components/parameters/JobId" }],
          responses: {
            "200": {
              description: "Job deleted.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobResponse" },
                },
              },
            },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/ServerError" },
          },
        },
      },
      "/v1/jobs/io": {
        post: {
          tags: ["Jobs"],
          summary: "Create I/O-bound job",
          description: "Creates a new I/O-bound job.",
          operationId: "createIOJob",
          parameters: [
            {
              name: "action",
              in: "query",
              required: true,
              schema: {
                type: "string",
                enum: ["writeLargeFile", "manySmallFiles"],
              },
              description: "I/O task to run.",
            },
            {
              name: "number",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 0, default: 0 },
              description:
                "Task input number (sizeBytes for writeLargeFile, count for manySmallFiles).",
            },
          ],
          responses: {
            "200": {
              description: "Job created.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateJobResponse" },
                },
              },
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "500": { $ref: "#/components/responses/ServerError" },
          },
        },
      },
      "/v1/jobs/cpu": {
        post: {
          tags: ["Jobs"],
          summary: "Create CPU-bound job",
          description: "Creates a new CPU-bound job.",
          operationId: "createCPUJob",
          parameters: [
            {
              name: "action",
              in: "query",
              required: true,
              schema: {
                type: "string",
                enum: ["countPrimesByTrialDivision", "fibonacciRecursive"],
              },
              description: "CPU task to run.",
            },
            {
              name: "number",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 0, default: 0 },
              description:
                "Task input number (n for primes or fibonacci).",
            },
          ],
          responses: {
            "200": {
              description: "Job created.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateJobResponse" },
                },
              },
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "500": { $ref: "#/components/responses/ServerError" },
          },
        },
      },
    },
    components: {
      parameters: {
        JobId: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Job ID",
        },
      },
      responses: {
        BadRequest: {
          description: "Bad request.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponseEnvelope" },
            },
          },
        },
        NotFound: {
          description: "Resource not found.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponseEnvelope" },
            },
          },
        },
        ServerError: {
          description: "Internal server error.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponseEnvelope" },
            },
          },
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["errorCode", "errorDescription"],
          properties: {
            errorCode: { type: "string" },
            errorDescription: { type: "string" },
            errorName: { type: "string" },
            stackTrace: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
        ErrorResponseEnvelope: {
          type: "object",
          required: ["isSuccess", "statusCode", "error"],
          properties: {
            isSuccess: { type: "boolean", example: false },
            statusCode: { type: "integer", format: "int32", example: 500 },
            error: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
        HealthResponse: {
          type: "object",
          required: ["isSuccess", "statusCode", "data"],
          properties: {
            isSuccess: { type: "boolean", example: true },
            statusCode: { type: "integer", format: "int32", example: 200 },
            data: { type: "boolean", example: true },
          },
        },
        Job: {
          type: "object",
          required: ["id", "type", "status", "createdAt"],
          properties: {
            id: { type: "string" },
            type: { $ref: "#/components/schemas/JobType" },
            status: { $ref: "#/components/schemas/JobStatus" },
            createdAt: { type: "string", format: "date-time" },
            startedAt: { type: "string", format: "date-time" },
            completedAt: { type: "string", format: "date-time" },
            result: { type: "object", additionalProperties: true },
            error: { type: "string" },
          },
        },
        JobType: {
          type: "string",
          enum: ["io", "cpu"],
        },
        JobStatus: {
          type: "string",
          enum: ["pending", "running", "completed", "failed"],
        },
        JobCreateRequest: {
          type: "object",
          description: "Payload for creating a job.",
          properties: {
            input: {
              type: "object",
              additionalProperties: true,
              description: "Job input payload.",
            },
          },
        },
        CreateJobSuccessResponse: {
          type: "object",
          required: ["id", "status", "type"],
          properties: {
            id: { type: "string" },
            status: { $ref: "#/components/schemas/JobStatus" },
            type: { $ref: "#/components/schemas/JobType" },
            description: { type: "string" },
          },
        },
        CreateJobResponse: {
          type: "object",
          required: ["isSuccess", "statusCode", "data"],
          properties: {
            isSuccess: { type: "boolean", example: true },
            statusCode: { type: "integer", format: "int32", example: 200 },
            data: { $ref: "#/components/schemas/CreateJobSuccessResponse" },
          },
        },
        JobResponse: {
          type: "object",
          required: ["isSuccess", "statusCode", "data"],
          properties: {
            isSuccess: { type: "boolean", example: true },
            statusCode: { type: "integer", format: "int32", example: 200 },
            data: { $ref: "#/components/schemas/Job" },
          },
        },
        JobListResponse: {
          type: "object",
          required: ["isSuccess", "statusCode", "data"],
          properties: {
            isSuccess: { type: "boolean", example: true },
            statusCode: { type: "integer", format: "int32", example: 200 },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Job" },
            },
          },
        },
        DeleteJobResponse: {
          type: "object",
          required: ["isSuccess", "statusCode", "data"],
          properties: {
            isSuccess: { type: "boolean", example: true },
            statusCode: { type: "integer", format: "int32", example: 200 },
            data: { type: "boolean", example: true },
          },
        },
      },
    },
  };
};
