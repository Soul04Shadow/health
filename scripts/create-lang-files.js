const fs = require('fs');
const path = require('path');

// Manually list the languages to avoid issues with requiring a .ts file in a .js script
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ur', name: 'Urdu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'or', name: 'Odia' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'mai', name: 'Maithili' },
  { code: 'sat', name: 'Santali' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'doi', name: 'Dogri' },
  { code: 'kok', name: 'Konkani' },
  { code: 'mni', name: 'Meitei' },
  { code: 'brx', name: 'Bodo' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'bho', name: 'Bhojpuri' },
  { code: 'raj', name: 'Rajasthani' },
  { code: 'mar', name: 'Marwari' },
  { code: 'snd', name: 'Sindhi' },
  { code: 'bnj', name: 'Banjari' },
];

const localesDir = path.join(__dirname, '..', 'locales');
const enPath = path.join(localesDir, 'en.json');

try {
  const enData = fs.readFileSync(enPath, 'utf8');
  
  languages.forEach(lang => {
    if (lang.code !== 'en' && lang.code !== 'hi') {
      const newPath = path.join(localesDir, `${lang.code}.json`);
      if (!fs.existsSync(newPath)) {
        fs.writeFileSync(newPath, enData);
        console.log(`Created ${newPath}`);
      }
    }
  });

  console.log('Language files created successfully.');

} catch (error) {
  console.error('Error creating language files:', error);
  process.exit(1);
}
