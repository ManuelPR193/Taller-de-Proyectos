import io
from xml.sax.saxutils import escape
from datetime import date
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.core.config import settings

def generate_sustainability_pdf(
    periodo_inicio: date,
    periodo_fin: date,
    total_co2_kg: float,
    total_distancia_km: float,
    combustible_ahorrado_l: float,
    cumplimiento_ventanas_pct: float,
    arboles_equivalentes: float,
    rutas_resumen: list,
    dias_sin_informacion=None,
    rutas_sin_base=0
) -> bytes:
    """Generates a professional Sustainability PDF Report (RF-006)."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#065F46") # Emerald 800
    SECONDARY = colors.HexColor("#047857") # Emerald 700
    ACCENT = colors.HexColor("#10B981") # Emerald 500
    DARK = colors.HexColor("#1F2937") # Gray 800
    LIGHT_BG = colors.HexColor("#F3F4F6") # Gray 100

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        "H2Style",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        textColor=SECONDARY,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        textColor=DARK,
        leading=13
    )

    elements = []

    # Header Title
    elements.append(Paragraph("EcoLogística Huancayo — DistriRápido S.A.C.", title_style))
    elements.append(Paragraph(f"REPORTE DE SOSTENIBILIDAD Y EMISIONES DE CARBONO", title_style))
    elements.append(Paragraph(f"Periodo evaluado: <b>{periodo_inicio.strftime('%d/%m/%Y')}</b> al <b>{periodo_fin.strftime('%d/%m/%Y')}</b> | Cobertura: Valle del Mantaro", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceAfter=15))

    # Executive KPI Summary Table
    elements.append(Paragraph("1. Resumen Ejecutivo de Impacto Ambiental", h2_style))
    
    kpi_data = [
        [
            Paragraph("<b>Emisiones de CO₂ Totales</b>", body_style),
            Paragraph(f"<b>{total_co2_kg:.2f} kg CO₂</b>", body_style),
            Paragraph("<b>Combustible Ahorrado</b>", body_style),
            Paragraph(f"<b>{combustible_ahorrado_l:.1f} Litros</b>", body_style),
        ],
        [
            Paragraph("<b>Distancia Recorrida Total</b>", body_style),
            Paragraph(f"<b>{total_distancia_km:.2f} km</b>", body_style),
            Paragraph("<b>Cumplimiento Ventanas</b>", body_style),
            Paragraph(f"<b>{cumplimiento_ventanas_pct:.1f}%</b>", body_style),
        ],
        [
            Paragraph("<b>Plan Compensación Árboles (RN-009)</b>", body_style),
            Paragraph(f"<b>{arboles_equivalentes:.1f} árboles/año</b>", body_style),
            Paragraph("<b>Estado de Huella Carbono</b>", body_style),
            Paragraph("<font color='#047857'><b>ESTIMACIÓN DE RUTAS</b></font>", body_style),
        ]
    ]

    kpi_table = Table(kpi_data, colWidths=[140, 120, 140, 120])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#D1D5DB")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 15))

    # Table of Executed Routes
    elements.append(Paragraph("2. Detalle Operativo por Ruta Planificada", h2_style))
    
    routes_headers = ["Fecha", "Placa Vehículo", "Conductor", "Distancia (km)", "CO₂ Emitido (kg)", "Combustible (L)", "Estado"]
    routes_rows = [[Paragraph(f"<b>{h}</b>", body_style) for h in routes_headers]]

    for r in rutas_resumen:
        routes_rows.append([
            Paragraph(r.get("fecha", "-"), body_style),
            Paragraph(escape(r.get("placa", "-")), body_style),
            Paragraph(escape(r.get("conductor", "-")), body_style),
            Paragraph(f"{r.get('distancia', 0):.2f}", body_style),
            Paragraph(f"{r.get('co2', 0):.2f}", body_style),
            Paragraph(f"{r.get('combustible', 0):.2f}", body_style),
            Paragraph(r.get("estado", "COMPLETADA"), body_style),
        ])

    if len(routes_rows) == 1:
        routes_rows.append([Paragraph("No se registraron rutas ejecutadas en el periodo seleccionado", body_style)] + [""] * 6)

    routes_table = Table(routes_rows, colWidths=[63, 62, 105, 64, 68, 65, 113], repeatRows=1)
    routes_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(routes_table)
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("3. Cobertura y metodología", h2_style))
    elements.append(Paragraph("Distancia vial planificada; emisiones = distancia por factor del vehículo. "
        "Ahorro estimado frente al orden secuencial de los mismos pedidos y vehículo, no ahorro medido en conducción. "
        "Cumplimiento calculado con entregas confirmadas y ventanas registradas. "
        "Árboles equivalentes = kg CO2 / factor anual configurado.", body_style))
    elements.append(Paragraph(f"Rutas sin base de comparación: {rutas_sin_base}. No se les atribuye ahorro.", body_style))
    elements.append(Paragraph("Días sin información: " + (", ".join(dias_sin_informacion or []) or "Ninguno"), body_style))
    elements.append(Spacer(1, 25))

    # Signatures Footer
    sig_data = [
        [Paragraph("___________________________<br/><b>Gerencia de Operaciones</b><br/>DistriRápido S.A.C.", body_style),
         Paragraph("___________________________<br/><b>Auditor Ambientalista</b><br/>EcoLogística Huancayo", body_style)]
    ]
    sig_table = Table(sig_data, colWidths=[270, 270])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(sig_table)

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
