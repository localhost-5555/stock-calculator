// src/data/markets.ts

export interface Stock {
  name: string;
  code: string;
}

export const markets = [
  { value: 'BVC', label: 'BVC (Colombia)' },
  { value: 'NYSE', label: 'NYSE (USA)' },
  { value: 'FAV', label: 'Favorites' }
];

export interface MarketGroup {
  label: string;
  items: Stock[];
}

export const COLOMBIAN_MARKETS: MarketGroup[] = [
  {
    label: 'Local Stocks (BVC)',
    items: [
      { name: 'Ecopetrol', code: 'ECOPETROL.CL' },
      { name: 'Cibest Pref.', code: 'PFCIBEST.CL' },
      { name: 'Cibest', code: 'CIBEST.CL' },
      { name: 'Corfi Pref', code: 'PFCORFICOL.CL' },
      { name: 'Corficol', code: 'CORFICOLCF.CL' },
      { name: 'ISA', code: 'ISA.CL' },
      { name: 'Grupo Energía Bogotá', code: 'GEB.CL' },
      { name: 'Grupo Sura Pref.', code: 'PFGRUPSURA.CL' },
      { name: 'Grupo Sura', code: 'GRUPOSURA.CL' },
      { name: 'Cementos Argos Pref.', code: 'PFCEMARGOS.CL' },
      { name: 'Cementos Argos', code: 'CEMARGOS.CL' },
      { name: 'Grupo Argos Pref.', code: 'PFGRUPOARG.CL' },
      { name: 'Grupo Argos', code: 'GRUPOARGOS.CL' },
      { name: 'Grupo Aval Pref.', code: 'PFAVAL.CL' },
      { name: 'Banco de Bogotá', code: 'BOGOTA.CL' },
      { name: 'BVC', code: 'BVC.CL' },
      { name: 'Celsia', code: 'CELSIA.CL' },
      { name: 'Terpel', code: 'TERPEL.CL' },
      { name: 'Mineros', code: 'MINEROS.CL' },
      { name: 'Canacol Energy', code: 'CNEC.CL' },
    ]
  },
  {
    label: 'International (MGC)',
    items: [
      { name: 'Apple Inc.', code: 'AAPLCO.CL' },
      { name: 'Amazon.com', code: 'AMZNCO.CL' },
      { name: 'NVIDIA', code: 'NVDACO.CL' },
      { name: 'Microsoft', code: 'MSFTCO.CL' },
      { name: 'Alphabet (Google)', code: 'GOOGLCO.CL' },
      { name: 'Meta (Facebook)', code: 'METACO.CL' },
      { name: 'Tesla', code: 'TSLACO.CL' },
      { name: 'Nubank', code: 'NUCO.CL' },
      { name: 'Berkshire Hathaway', code: 'BRK-BCO.CL' },
      { name: 'JP Morgan', code: 'JPMCO.CL' },
      { name: 'Coca-Cola', code: 'KOCO.CL' },
    ]
  },
  {
    label: 'ETFs',
    items: [
      { name: 'iShares MSCI COLCAP', code: 'ICOLCAP.CL' },
      { name: 'iShares S&P 500 (UCITS)', code: 'CSPX.L' },
      { name: 'Invesco Nasdaq-100', code: 'EQAC.L' },
    ]
  }
];

// If you still need the Tech/Finance list, you can export it here too
export const US_MARKETS: MarketGroup[] = [
  {
    label: 'Technology',
    items: [
      { name: 'NVIDIA', code: 'NVDACO.CL' },
      { name: 'Microsoft', code: 'MSFTCO.CL' },
      { name: 'Apple', code: 'AAPLCO.CL' },
      { name: 'Amazon', code: 'AMZNCO.CL' },
      { name: 'NUBANK', code: 'NUCO.CL' },
      { name: 'Meta', code: 'METACO.CL' },
      { name: 'Google', code: 'GOOGLCO.CL' },
      { name: 'Berkshire Hathaway', code: 'BRKBCO.CL' },
    ]
  },
  {
    label: 'Finance',
    items: [
      { name: 'JP Morgan Chase', code: 'JPM' },
      { name: 'Bank of America', code: 'BAC' },
      { name: 'Goldman Sachs', code: 'GS' },
      { name: 'Morgan Stanley', code: 'MS' },
      { name: 'Citigroup', code: 'C' },
      { name: 'American Express', code: 'AXP' },
      { name: 'BlackRock', code: 'BLK' },
    ]
  },
];