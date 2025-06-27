import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const staleTime = 1 * 60 * 60 * 1000;


export const categoriesList = ["plumber", "electrical", "carpentors", "c.p.v.c_pipe_and_fittings", "u.p.v.c_pipe_and_fittings", "g.i_fittings", "sanitary_and_fittings"] as const;

export const categoriesDisplayList: {value: typeof categoriesList[number], name: string}[] = [
  {
    value: "plumber",
    name: "Plumber"
  }, 
  {
    value: "electrical",
    name: "Electrical",
  },
  {
    value: "carpentors",
    name: "Carpentors",
  },
  {
    value: "c.p.v.c_pipe_and_fittings",
    name: "C.P.V.C Pipe And Fittings"
  },
  {
    value: "u.p.v.c_pipe_and_fittings",
    name: "U.P.V.C Pipe And Fittings"
  },
  {
    name: "G.I Fittings",
    value: "g.i_fittings"
  },
  {
    name: 'Sanitary And Fittings',
    value: "sanitary_and_fittings"
  }

]