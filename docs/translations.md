###### Managing translations

The text for this application is all translated into multiple locales:

-  English (default)
-  French
-  Hindi
-  Swahili
-  Somali
-  Amharic

Additional translations may be added in the future.

The training content is stored in the database as separate documents for each
locale, and the user sets their current locale by choosing a subject in
that language.  

The static content for the application is all stored in the directory

`/public/locales`

Each subdirectory represents one of the locales that we translate into 
(using the 2 character ISO code) and contains a file called `translation.json`
that has all the text for that locale.

The translation is handled by `react-i18next` which in turn uses `i18next`
under the hood.  All of the static text for the application should be 
presented using this system; there should not be any hard-coded text outside
of the `translation.json` files.

When coding, you will only modify the English text and then need to run 
the translation process when you are done

`npm run translate`

to generate the other locales.

Most of the time, using translations follows this basic pattern:

`import {useTranslation} from "react-i18next";`
`import i18n from '../i18n';`

... inside your component

`const { t } = useTranslation(['translation'], {i18n} );`

... inside the return value of the component

`{t('foo.bar.something')}`

See https://www.i18next.com/ for more information.
