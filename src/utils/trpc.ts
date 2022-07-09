import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "../backend/router";
//This takes the entire router as a type from the backend and generates hooks to use on the front end
//It runs the build and the backend types get eradicated super strict
export const trpc = createReactQueryHooks<AppRouter>();
