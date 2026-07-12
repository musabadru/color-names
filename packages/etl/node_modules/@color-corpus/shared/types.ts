export interface Source {
  id: string;
  slug: string;
  name: string;
  kind?: string;
  organization?: string;
  publication_year?: number;
}

export interface SourceColor {
  id: string;
  source_id: string;
  local_code?: string;
  primary_name_raw: string;
  hex_color?: string;
}

export interface NormalizedName {
  id: string;
  normalized_form: string;
  display_form: string;
}
