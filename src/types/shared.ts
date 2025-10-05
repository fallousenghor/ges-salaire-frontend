// Types partagés alignés sur le backend
export type TypePeriode = 'MENSUEL' | 'HEBDO' | 'JOURNALIER';
export type StatutEmploye = 'ACTIF' | 'INACTIF' | 'VACATAIRE';
export type StatutPayRun = 'BROUILLON' | 'APPROUVE' | 'CLOTURE';
export type StatutPayslip = 'EN_ATTENTE' | 'PARTIEL' | 'PAYE';
export type ModePaiement = 'ESPECES' | 'VIREMENT' | 'ORANGE_MONEY' | 'WAVE' | 'AUTRE';
export type TypeContrat = 'JOURNALIER' | 'FIXE' | 'HONORAIRE';