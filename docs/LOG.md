# Log diario - Ministerio Mana Web

**Registro histórico corto. Para estado actual ver: `WORKBOARD.md`**

---

## 2026-01-25
**Hoy**
- NOVA: Actualizó WORKBOARD con estado real del proyecto
- NOVA: Creó LOG.md con historial de últimos días
- DELTA: Creó estructura inicial de WORKBOARD y LOG

**Decisiones**
- Sistema de tickets MANA-XXX implementado
- WORKBOARD = source of truth del estado
- LOG = registro histórico diario (corto)

**Riesgos**
- N/A

**Próximo**
- Usuario debe ejecutar `npm install` para Lenis/GSAP
- Probar animaciones en dev server
- Si funciona, mover MANA-001 a Done

---

## 2026-01-24
**Hoy**
- NOVA: Implementó parallax (Lenis + GSAP) en componentes existentes (MANA-001)
- NOVA: Revirtió Cosmic Design por eliminar contenido original (MANA-003)
- DELTA: Creó docs de equipo y bitácora (MANA-002)

**Decisiones**
- ✅ Smooth scroll: Lenis
- ✅ Animaciones: GSAP ScrollTrigger
- ❌ Cosmic Design: Rechazado
- ✅ Paleta: Mantener beige/navy

**Riesgos**
- Mobile: animaciones pueden ser pesadas

**Próximo**
- Instalar deps y probar
- Optimizar mobile si necesario

---

## 2026-01-23
**Hoy**
- DELTA: Rediseño Home Storytelling
- DELTA: Fix tailwind.config PostCSS error

**Próximo**
- Validar build en CI

---

## 2026-01-22
**Hoy**
- DELTA: Iteraciones hero/header/nav
- DELTA: Historia con timeline + globo

**Próximo**
- Ajustar estilo final

---

_Para historial completo desde 2025-11-02, ver `bitacora.md`_
