/**
 * Company Legal Information
 * 
 * Administrative and legal data for Equipement Ouarzazate
 * Source: Client documents - January 2026
 * 
 * @module config/company
 */

/**
 * Company legal information type
 */
export interface CompanyLegalInfo {
    capital: string;
    rc: string;
    patente: string;
    if: string;
    cnss: string;
    ice: string;
}

/**
 * Company information configuration
 */
export const companyInfo = {
    // Identité
    name: 'Equipement Ouarzazate',
    legalName: 'EQUIPEMENT OUARZAZATE SARL',
    slogan: 'Des Matériaux Fiables Pour Bâtir Vos Rêves',
    foundingYear: 1970,

    // Informations légales
    legal: {
        /** Capital social */
        capital: '15 000 000,00 DH',
        /** Registre du Commerce */
        rc: '9/238',
        /** Patente */
        patente: '47104500',
        /** Identifiant Fiscal */
        if: '06590134',
        /** Numéro CNSS */
        cnss: '1578080',
        /** Identifiant Commun de l'Entreprise */
        ice: '001537780000014',
    } as CompanyLegalInfo,

    // Site web actuel (legacy)
    legacyWebsite: 'http://www.equipementouarzazate.com',
} as const;

/**
 * Format legal info for footer display
 * Shows only ICE and RC (most important legally)
 */
export const getFooterLegalText = (): string => {
    return `ICE: ${companyInfo.legal.ice} | RC: ${companyInfo.legal.rc}`;
};

/**
 * Get all legal info for mentions légales page
 */
export const getLegalInfoList = () => [
    { label: 'Raison sociale', value: companyInfo.legalName },
    { label: 'Capital social', value: companyInfo.legal.capital },
    { label: 'Registre du Commerce', value: companyInfo.legal.rc },
    { label: 'Patente', value: companyInfo.legal.patente },
    { label: 'Identifiant Fiscal (IF)', value: companyInfo.legal.if },
    { label: 'CNSS', value: companyInfo.legal.cnss },
    { label: 'ICE', value: companyInfo.legal.ice },
];

export type CompanyInfo = typeof companyInfo;
export default companyInfo;
