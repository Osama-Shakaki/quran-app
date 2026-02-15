import { quranJuzData, QURAN_SURAHS } from './quran_metadata';

export interface SurahInJuz {
    number: number;
    name: string;
    startPage: number;
}

export interface JuzIndexItem {
    id: number;
    name: string;
    startPage: number;
    endPage: number;
    surahs: SurahInJuz[];
}

export const QURAN_INDEX_DATA: JuzIndexItem[] = quranJuzData.map((juz, index) => {
    const startPage = juz.startPage;
    const nextJuz = quranJuzData[index + 1];
    const endPage = nextJuz ? nextJuz.startPage - 1 : 604;

    const surahsInJuz: SurahInJuz[] = [];

    // 1. Check for continuing Surah from previous Juz
    // Find the surah that covers the startPage of this Juz
    const currentSurahIndex = QURAN_SURAHS.findIndex((s, i) => {
        const nextS = QURAN_SURAHS[i + 1];
        return s.startPage <= startPage && (!nextS || nextS.startPage > startPage);
    });

    if (currentSurahIndex !== -1) {
        const currentSurah = QURAN_SURAHS[currentSurahIndex];
        // If it started strictly before this Juz, it's a "continuation"
        if (currentSurah.startPage < startPage) {
            surahsInJuz.push({
                number: currentSurah.number,
                name: `تابع ${currentSurah.name}`,
                startPage: startPage
            });
        }
    }

    // 2. Add Surahs that START in this Juz
    const startingSurahs = QURAN_SURAHS.filter(s => s.startPage >= startPage && s.startPage <= endPage);

    // Map to our format
    startingSurahs.forEach(s => {
        surahsInJuz.push({
            number: s.number,
            name: s.name,
            startPage: s.startPage
        });
    });

    return {
        id: juz.id,
        name: juz.name,
        startPage: startPage,
        endPage: endPage,
        surahs: surahsInJuz
    };
});
