export interface PageData {
    id: string;
    pageNumber: number; // File Index 1-608
    quranPageNumber?: number; // Logical Page 1-604
    imageSrc: string;
    juz?: number;
    surah?: string;
    isIntro?: boolean;
}

export interface JuzInfo {
    id: number;
    name: string;
    startPage: number;
    surahs: string;
}

export const QURAN_SURAHS = [
    { number: 1, name: "الفاتحة", startPage: 1 },
    { number: 2, name: "البقرة", startPage: 2 },
    { number: 3, name: "آل عمران", startPage: 50 },
    { number: 4, name: "النساء", startPage: 77 },
    { number: 5, name: "المائدة", startPage: 106 },
    { number: 6, name: "الأنعام", startPage: 128 },
    { number: 7, name: "الأعراف", startPage: 151 },
    { number: 8, name: "الأنفال", startPage: 177 },
    { number: 9, name: "التوبة", startPage: 187 },
    { number: 10, name: "يونس", startPage: 208 },
    { number: 11, name: "هود", startPage: 221 },
    { number: 12, name: "يوسف", startPage: 235 },
    { number: 13, name: "الرعد", startPage: 249 },
    { number: 14, name: "إبراهيم", startPage: 255 },
    { number: 15, name: "الحجر", startPage: 262 },
    { number: 16, name: "النحل", startPage: 267 },
    { number: 17, name: "الإسراء", startPage: 282 },
    { number: 18, name: "الكهف", startPage: 293 },
    { number: 19, name: "مريم", startPage: 305 },
    { number: 20, name: "طه", startPage: 312 },
    { number: 21, name: "الأنبياء", startPage: 322 },
    { number: 22, name: "الحج", startPage: 332 },
    { number: 23, name: "المؤمنون", startPage: 342 },
    { number: 24, name: "النور", startPage: 350 },
    { number: 25, name: "الفرقان", startPage: 359 },
    { number: 26, name: "الشعراء", startPage: 367 },
    { number: 27, name: "النمل", startPage: 377 },
    { number: 28, name: "القصص", startPage: 385 },
    { number: 29, name: "العنكبوت", startPage: 396 },
    { number: 30, name: "الروم", startPage: 404 },
    { number: 31, name: "لقمان", startPage: 411 },
    { number: 32, name: "السجدة", startPage: 415 },
    { number: 33, name: "الأحزاب", startPage: 418 },
    { number: 34, name: "سبأ", startPage: 428 },
    { number: 35, name: "فاطر", startPage: 434 },
    { number: 36, name: "يس", startPage: 440 },
    { number: 37, name: "الصافات", startPage: 446 },
    { number: 38, name: "ص", startPage: 453 },
    { number: 39, name: "الزمر", startPage: 458 },
    { number: 40, name: "غافر", startPage: 467 },
    { number: 41, name: "فصلت", startPage: 477 },
    { number: 42, name: "الشورى", startPage: 483 },
    { number: 43, name: "الزخرف", startPage: 489 },
    { number: 44, name: "الدخان", startPage: 496 },
    { number: 45, name: "الجاثية", startPage: 499 },
    { number: 46, name: "الأحقاف", startPage: 502 },
    { number: 47, name: "محمد", startPage: 507 },
    { number: 48, name: "الفتح", startPage: 511 },
    { number: 49, name: "الحجرات", startPage: 515 },
    { number: 50, name: "ق", startPage: 518 },
    { number: 51, name: "الذاريات", startPage: 520 },
    { number: 52, name: "الطور", startPage: 523 },
    { number: 53, name: "النجم", startPage: 526 },
    { number: 54, name: "القمر", startPage: 528 },
    { number: 55, name: "الرحمن", startPage: 531 },
    { number: 56, name: "الواقعة", startPage: 534 },
    { number: 57, name: "الحديد", startPage: 537 },
    { number: 58, name: "المجادلة", startPage: 542 },
    { number: 59, name: "الحشر", startPage: 545 },
    { number: 60, name: "الممتحنة", startPage: 549 },
    { number: 61, name: "الصف", startPage: 551 },
    { number: 62, name: "الجمعة", startPage: 553 },
    { number: 63, name: "المنافقون", startPage: 554 },
    { number: 64, name: "التغابن", startPage: 556 },
    { number: 65, name: "الطلاق", startPage: 558 },
    { number: 66, name: "التحريم", startPage: 560 },
    { number: 67, name: "الملك", startPage: 562 },
    { number: 68, name: "القلم", startPage: 564 },
    { number: 69, name: "الحاقة", startPage: 566 },
    { number: 70, name: "المعارج", startPage: 568 },
    { number: 71, name: "نوح", startPage: 570 },
    { number: 72, name: "الجن", startPage: 572 },
    { number: 73, name: "المزمل", startPage: 574 },
    { number: 74, name: "المدثر", startPage: 575 },
    { number: 75, name: "القيامة", startPage: 577 },
    { number: 76, name: "الإنسان", startPage: 578 },
    { number: 77, name: "المرسلات", startPage: 580 },
    { number: 78, name: "النبأ", startPage: 582 },
    { number: 79, name: "النازعات", startPage: 583 },
    { number: 80, name: "عبس", startPage: 585 },
    { number: 81, name: "التكوير", startPage: 586 },
    { number: 82, name: "الانفطار", startPage: 587 },
    { number: 83, name: "المطففين", startPage: 587 },
    { number: 84, name: "الانشقاق", startPage: 589 },
    { number: 85, name: "البروج", startPage: 590 },
    { number: 86, name: "الطارق", startPage: 591 },
    { number: 87, name: "الأعلى", startPage: 591 },
    { number: 88, name: "الغاشية", startPage: 592 },
    { number: 89, name: "الفجر", startPage: 593 },
    { number: 90, name: "البلد", startPage: 594 },
    { number: 91, name: "الشمس", startPage: 595 },
    { number: 92, name: "الليل", startPage: 595 },
    { number: 93, name: "الضحى", startPage: 596 },
    { number: 94, name: "الشرح", startPage: 596 },
    { number: 95, name: "التين", startPage: 597 },
    { number: 96, name: "العلق", startPage: 597 },
    { number: 97, name: "القدر", startPage: 598 },
    { number: 98, name: "البينة", startPage: 598 },
    { number: 99, name: "الزلزلة", startPage: 599 },
    { number: 100, name: "العاديات", startPage: 599 },
    { number: 101, name: "القارعة", startPage: 600 },
    { number: 102, name: "التكاثر", startPage: 600 },
    { number: 103, name: "العصر", startPage: 601 },
    { number: 104, name: "الهمزة", startPage: 601 },
    { number: 105, name: "الفيل", startPage: 601 },
    { number: 106, name: "قريش", startPage: 602 },
    { number: 107, name: "الماعون", startPage: 602 },
    { number: 108, name: "الكوثر", startPage: 602 },
    { number: 109, name: "الكافرون", startPage: 603 },
    { number: 110, name: "النصر", startPage: 603 },
    { number: 111, name: "المسد", startPage: 603 },
    { number: 112, name: "الإخلاص", startPage: 604 },
    { number: 113, name: "الفلق", startPage: 604 },
    { number: 114, name: "الناس", startPage: 604 }
];

export const quranJuzData: JuzInfo[] = [
    { id: 1, name: "الجزء الأول", startPage: 1, surahs: "الفاتحة، البقرة" },
    { id: 2, name: "الجزء الثاني", startPage: 22, surahs: "تكملة البقرة - سيقول السفهاء" },
    { id: 3, name: "الجزء الثالث", startPage: 42, surahs: "تكملة البقرة - تلك الرسل، بداية آل عمران" },
    { id: 4, name: "الجزء الرابع", startPage: 62, surahs: "تكملة آل عمران - لن تنالوا، بداية النساء" },
    { id: 5, name: "الجزء الخامس", startPage: 82, surahs: "تكملة النساء - والمحصنات" },
    { id: 6, name: "الجزء السادس", startPage: 102, surahs: "تكملة النساء - لا يحب الله، بداية المائدة" },
    { id: 7, name: "الجزء السابع", startPage: 121, surahs: "تكملة المائدة - لتجدن، بداية الأنعام" },
    { id: 8, name: "الجزء الثامن", startPage: 142, surahs: "تكملة الأنعام - ولو أننا، بداية الأعراف" },
    { id: 9, name: "الجزء التاسع", startPage: 162, surahs: "تكملة الأعراف - قال الملأ، بداية الأنفال" },
    { id: 10, name: "الجزء العاشر", startPage: 182, surahs: "تكملة الأنفال - واعلموا، بداية التوبة" },
    { id: 11, name: "الجزء الحادي عشر", startPage: 201, surahs: "تكملة التوبة - يعتذرون، يونس، هود" },
    { id: 12, name: "الجزء الثاني عشر", startPage: 221, surahs: "تكملة هود - وما من دابة، يوسف" },
    { id: 13, name: "الجزء الثالث عشر", startPage: 241, surahs: "تكملة يوسف - وما أبرئ، الرعد، إبراهيم" },
    { id: 14, name: "الجزء الرابع عشر", startPage: 262, surahs: "ربما، الحجر، النحل" },
    { id: 15, name: "الجزء الخامس عشر", startPage: 282, surahs: "سبحان، الإسراء، الكهف" },
    { id: 16, name: "الجزء السادس عشر", startPage: 302, surahs: "قال ألم، تكملة الكهف، مريم، طه" },
    { id: 17, name: "الجزء السابع عشر", startPage: 322, surahs: "اقترب، الأنبياء، الحج" },
    { id: 18, name: "الجزء الثامن عشر", startPage: 342, surahs: "قد أفلح، المؤمنون، النور، الفرقان" },
    { id: 19, name: "الجزء التاسع عشر", startPage: 362, surahs: "وقال الذين، تكملة الفرقان، الشعراء، النمل" },
    { id: 20, name: "الجزء العشرون", startPage: 382, surahs: "فما كان، تكملة النمل، القصص، العنكبوت" },
    { id: 21, name: "الجزء الحادي والعشرون", startPage: 402, surahs: "ولا تجادلوا، تكملة العنكبوت، الروم، لقمان، السجدة، الأحزاب" },
    { id: 22, name: "الجزء الثاني والعشرون", startPage: 422, surahs: "ومن يقنت، تكملة الأحزاب، سبأ، فاطر، يس" },
    { id: 23, name: "الجزء الثالث والعشرون", startPage: 442, surahs: "وما أنزلنا، تكملة يس، الصافات، ص، الزمر" },
    { id: 24, name: "الجزء الرابع والعشرون", startPage: 462, surahs: "فمن أظلم، تكملة الزمر، غافر، فصلت" },
    { id: 25, name: "الجزء الخامس والعشرون", startPage: 482, surahs: "إليه يرد، تكملة فصلت، الشورى، الزخرف، الدخان، الجاثية" },
    { id: 26, name: "الجزء السادس والعشرون", startPage: 502, surahs: "حم، الأحقاف، محمد، الفتح، الحجرات، ق، الذاريات" },
    { id: 27, name: "الجزء السابع والعشرون", startPage: 522, surahs: "قال فما خطبكم، تكملة الذاريات، الطور، النجم، القمر، الرحمن، الواقعة، الحديد" },
    { id: 28, name: "الجزء الثامن والعشرون", startPage: 542, surahs: "قد سمع، المجادلة، الحشر، الممتحنة، الصف، الجمعة، المنافقون، التغابن، الطلاق، التحريم" },
    { id: 29, name: "الجزء التاسع والعشرون", startPage: 562, surahs: "تبارك، الملك، القلم، الحاقة، المعارج، نوح، الجن، المزمل، المدثر، القيامة، الإنسان، المرسلات" },
    { id: 30, name: "الجزء الثلاثون", startPage: 582, surahs: "عم يتساءلون، النبأ إلى الناس" }
];

export const QURAN_PAGES: PageData[] = Array.from({ length: 607 }, (_, i) => {
    const fileIndex = i + 1;
    let quranPageNum: number | undefined = undefined;
    let isIntro = false;
    let juz: number | undefined = undefined;
    let surahName = "";

    if (fileIndex === 1) {
        surahName = "غلاف المصحف";
        isIntro = true;
    } else if (fileIndex === 2 || fileIndex === 3) {
        surahName = "المقدمة";
        isIntro = true;
    } else {
        quranPageNum = fileIndex - 3;
        juz = 30; // Default fallback

        // Find Juz using actual Quran Page Number
        for (let j = 0; j < quranJuzData.length; j++) {
            if (quranPageNum >= quranJuzData[j].startPage) {
                juz = quranJuzData[j].id;
            } else {
                break;
            }
        }

        // Find Surah using actual Quran Page Number
        for (let s = QURAN_SURAHS.length - 1; s >= 0; s--) {
            if (QURAN_SURAHS[s].startPage <= quranPageNum) {
                surahName = QURAN_SURAHS[s].name;
                break;
            }
        }
    }

    return {
        id: `quran-file-${fileIndex}`,
        pageNumber: fileIndex, // Navigation ID (1-607)
        quranPageNumber: quranPageNum, // Logical Page
        imageSrc: `/images/quran/page-${String(fileIndex).padStart(3, '0')}.webp`,
        juz: juz,
        surah: surahName || "",
        isIntro: isIntro
    };
});


export const THOUGHTS_PAGES: PageData[] = Array.from({ length: 108 }, (_, i) => {
    const sequentialPage = i + 1;
    // Calculate actual filename offset due to deleted files 54.webp and 101.webp
    let filePage = sequentialPage;
    if (sequentialPage >= 54) {
        filePage += 1; // Skip 54
    }
    // We check against 100 here since if sequentialPage is 100, filePage is 101 (which is deleted)
    if (sequentialPage >= 100) {
        filePage += 1; // Skip 101
    }

    return {
        id: `thoughts-${sequentialPage}`,
        pageNumber: sequentialPage,
        imageSrc: `/images/thoughts/${filePage}.webp`,
    };
});
