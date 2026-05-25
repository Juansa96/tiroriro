-- Trigger: cuando llega un formulario de la web (contact_leads),
-- crea automáticamente un lead en la tabla leads del CRM.

CREATE OR REPLACE FUNCTION public.sync_contact_lead_to_crm()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_producto TEXT;
BEGIN
  -- Usar el primer producto de la lista (puede venir como "Cabeceros, Bancos entelados")
  v_producto := split_part(NEW.productos, ',', 1);
  -- Recortar espacios
  v_producto := trim(v_producto);

  INSERT INTO public.leads (
    nombre,
    email,
    telefono,
    ciudad,
    producto,
    vendedor,
    etapa,
    valor,
    valor_producto,
    valor_envio,
    origen,
    red_social,
    edad,
    created_at,
    updated_at
  ) VALUES (
    COALESCE(NEW.nombre || CASE WHEN NEW.apellidos IS NOT NULL AND NEW.apellidos != '' THEN ' ' || NEW.apellidos ELSE '' END, NEW.nombre),
    NEW.email,
    COALESCE(NEW.telefono, ''),
    '',            -- ciudad: no disponible en el formulario web
    v_producto,
    '',            -- vendedor: se asignará manualmente en el CRM
    'Primer Contacto',
    0,
    0,
    0,
    'web',
    '',
    '',
    NEW.created_at,
    NEW.created_at
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_contact_lead_to_crm
  AFTER INSERT ON public.contact_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_contact_lead_to_crm();
