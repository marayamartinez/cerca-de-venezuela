// Script de semilla — carga los datos iniciales a Supabase.
// Ejecutar UNA sola vez: node --env-file=.env scripts/seed.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(join(__dir, '../src/data/centros.json'), 'utf-8'))

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// ── Centros ──────────────────────────────────────────────
async function seedCentros() {
  const centros = data.centros.map(({ id: _id, provincia: _p, ...c }) => ({
    ciudad: c.ciudad,
    local: c.local,
    direccion: c.direccion,
    horario: c.horario,
    abierto: c.abierto ?? true,
    maps_url: c.maps_url ?? null,
    lat: c.lat ?? null,
    lng: c.lng ?? null,
    necesidades: c.necesidades ?? {},
  }))

  const { error } = await supabase.from('centros').insert(centros)
  if (error) throw new Error(`centros: ${error.message}`)
  console.log(`✅ ${centros.length} centros insertados`)
}

// ── Categorías y artículos de donación ───────────────────
const DONACION = [
  {
    nombre: 'Alimentación',
    articulos: [
      'Agua potable embotellada',
      'Sueros orales',
      'Alimentos enlatados (indicar gramaje en la etiqueta)',
      'Galletas nutritivas y barras energéticas',
      'Frutos secos',
      'Frutas',
      'Leche líquida',
      'Compotas',
      'Fórmulas para niños',
    ],
  },
  {
    nombre: 'Higiene personal',
    articulos: [
      'Crema dental',
      'Papel higiénico',
      'Pañales para bebés (indicar talla en la bolsa)',
      'Pañales para adultos (indicar talla en la bolsa)',
      'Toallitas húmedas',
      'Bolsas de basura resistentes',
    ],
  },
  {
    nombre: 'Primeros auxilios',
    articulos: [
      'Guantes desechables',
      'Vendas',
      'Alcohol',
      'Jeringas / inyectadoras',
      'Curitas',
      'Agua oxigenada',
      'Paracetamol',
      'Ibuprofeno',
      'Mascarillas',
      'Solución salina',
      'Termómetro',
      'Medicamentos analgésicos y antialérgicos',
    ],
  },
  {
    nombre: 'Materiales para rescatistas',
    articulos: [
      'Cascos de protección',
      'Guantes de protección',
      'Linternas y lámparas frontales',
      'Cinceles y picos',
      'Tobos y palas',
      'Mandarria',
      'Disco de corte',
    ],
  },
]

async function seedDonacion() {
  for (let i = 0; i < DONACION.length; i++) {
    const cat = DONACION[i]
    const { data: inserted, error } = await supabase
      .from('categorias_donacion')
      .insert({ nombre: cat.nombre, orden: i })
      .select('id')
      .single()
    if (error) throw new Error(`categoria ${cat.nombre}: ${error.message}`)

    const articulos = cat.articulos.map((texto, j) => ({
      categoria_id: inserted.id,
      texto,
      orden: j,
    }))
    const { error: artError } = await supabase.from('articulos_donacion').insert(articulos)
    if (artError) throw new Error(`articulos de ${cat.nombre}: ${artError.message}`)
    console.log(`✅ Categoría "${cat.nombre}" con ${articulos.length} artículos`)
  }
}

// ── Main ─────────────────────────────────────────────────
console.log('🚀 Cargando datos iniciales a Supabase...\n')
try {
  await seedCentros()
  await seedDonacion()
  console.log('\n✅ Semilla completa. Ya puedes usar Supabase.')
} catch (e) {
  console.error('\n❌ Error:', e.message)
  process.exit(1)
}
