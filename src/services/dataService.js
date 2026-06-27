import data from '../data/centros.json'

// Capa de datos — hoy lee del JSON local.
// Para conectar Supabase (Fase 2): reemplazar solo este archivo.

export const getCategorias = () => Promise.resolve(data.categorias)

export const getCentros = () => Promise.resolve(data.centros)

export const getCentrosPorCiudad = (ciudad) =>
  Promise.resolve(data.centros.filter((c) => c.ciudad === ciudad))

export const getCiudades = () => {
  const set = new Set(data.centros.map((c) => c.ciudad))
  return Promise.resolve([...set].sort())
}
