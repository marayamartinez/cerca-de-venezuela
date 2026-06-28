import { supabase } from './supabaseClient'
import data from '../data/centros.json'

// Las categorías de necesidad (alimentos, agua, etc.) siguen en el JSON —
// son un esquema fijo que el admin gestiona por centro, no una tabla propia.
export const getCategorias = () => Promise.resolve(data.categorias)

// ── Config ────────────────────────────────────────────────────────────────

export const getConfig = async (clave) => {
  const { data: row, error } = await supabase
    .from('config')
    .select('valor')
    .eq('clave', clave)
    .single()
  if (error) return null
  return row.valor
}

export const setConfig = async (clave, valor) => {
  const { error } = await supabase
    .from('config')
    .upsert({ clave, valor: String(valor) })
  if (error) throw error
}

// ── Centros ───────────────────────────────────────────────────────────────

export const getCiudades = async () => {
  const { data: centros, error } = await supabase
    .from('centros')
    .select('ciudad')
    .order('ciudad')
  if (error) throw error
  return [...new Set(centros.map((c) => c.ciudad))].sort()
}

export const getCentrosPorCiudad = async (ciudad) => {
  const { data: centros, error } = await supabase
    .from('centros')
    .select('*')
    .eq('ciudad', ciudad)
    .order('abierto', { ascending: false })
    .order('local')
  if (error) throw error
  return centros
}

export const getAllCentros = async () => {
  const { data: centros, error } = await supabase
    .from('centros')
    .select('*')
    .order('ciudad')
    .order('local')
  if (error) throw error
  return centros
}

export const createCentro = async (centro) => {
  const { data: created, error } = await supabase
    .from('centros')
    .insert(centro)
    .select()
    .single()
  if (error) throw error
  return created
}

export const updateCentro = async (id, campos) => {
  const { error } = await supabase.from('centros').update(campos).eq('id', id)
  if (error) throw error
}

export const deleteCentro = async (id) => {
  const { error } = await supabase.from('centros').delete().eq('id', id)
  if (error) throw error
}

// ── Categorías y artículos de donación ───────────────────────────────────

export const getCategoriasDonacion = async () => {
  const { data: cats, error: catErr } = await supabase
    .from('categorias_donacion')
    .select('*')
    .order('orden')
  if (catErr) throw catErr

  const { data: arts, error: artErr } = await supabase
    .from('articulos_donacion')
    .select('*')
    .order('orden')
  if (artErr) throw artErr

  return cats.map((cat) => ({
    ...cat,
    articulos: arts.filter((a) => a.categoria_id === cat.id),
  }))
}

export const createCategoriaDonacion = async (nombre) => {
  const { data: created, error } = await supabase
    .from('categorias_donacion')
    .insert({ nombre, orden: 999 })
    .select()
    .single()
  if (error) throw error
  return created
}

export const deleteCategoriaDonacion = async (id) => {
  const { error } = await supabase.from('categorias_donacion').delete().eq('id', id)
  if (error) throw error
}

export const updateCategoriaDonacion = async (id, nombre) => {
  const { error } = await supabase
    .from('categorias_donacion')
    .update({ nombre })
    .eq('id', id)
  if (error) throw error
}

export const createArticulo = async (categoria_id, texto) => {
  const { data: created, error } = await supabase
    .from('articulos_donacion')
    .insert({ categoria_id, texto, orden: 999 })
    .select()
    .single()
  if (error) throw error
  return created
}

export const updateArticulo = async (id, texto) => {
  const { error } = await supabase
    .from('articulos_donacion')
    .update({ texto })
    .eq('id', id)
  if (error) throw error
}

export const deleteArticulo = async (id) => {
  const { error } = await supabase.from('articulos_donacion').delete().eq('id', id)
  if (error) throw error
}
