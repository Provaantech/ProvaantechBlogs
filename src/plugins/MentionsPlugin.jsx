/**
 * Mentions Plugin
 * Handles @mentions with typeahead functionality
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import React, { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { $createMentionNode, MentionNode } from '../nodes/MentionNode';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mentionsCache = new Map();

const dummyMentionsData = [
  'Aayla Secura',
  'Adi Gallia',
  'Admiral Dodd Rancit',
  'Admiral Firmus Piett',
  'Admiral Gial Ackbar',
  'Admiral Ozzel',
  'Admiral Raddus',
  'Admiral Terrinald Screed',
  'Admiral Trench',
  'Admiral U.O. Statura',
  'Agen Kolar',
  'Agent Kallus',
  'Aiolin and Morit Astarte',
  'Aks Moe',
  'Almec',
  'Alton Kastle',
  'Amee',
  'AP-5',
  'Armitage Hux',
  'Artoo',
  'Asajj Ventress',
  'Aurra Sing',
  'AZI-3',
  'Bala-Tik',
  'Barada',
  'Bargwill Tomder',
  'Baron Papanoida',
  'Barriss Offee',
  'Baze Malbus',
  'Bazine Netal',
  'BB-8',
  'BB-9E',
  'Ben Quadinaros',
  'Berch Teller',
  'Beru Lars',
  'Bib Fortuna',
  'Biggs Darklighter',
  'Black Krrsantan',
  'Bo-Katan Kryze',
  'Boba Fett',
  'Bodhi Rook',
  'Boss Nass',
  'Bossk',
  'Breha Antilles-Organa',
  'Bren Derlin',
  'Brendol Hux',
  'BT-1',
  'C-3PO',
  'C1-10P',
  'Cad Bane',
  'Caluan Ematt',
  'Captain Gregor',
  'Captain Phasma',
  'Captain Quarsh Panaka',
  'Captain Rex',
  'Carlist Rieekan',
  'Casca Panzoro',
  'Cassian Andor',
  'Cassio Tagge',
  'Cham Syndulla',
  'Che Amanwe Papanoida',
  'Chewbacca',
  'Chi Eekway Papanoida',
  'Chief Chirpa',
  'Chirrut Îmwe',
  'Ciena Ree',
  'Cin Drallig',
  'Clone Trooper Boil',
  'Clone Trooper Sinker',
  'Clone Trooper Waxer',
  'Conan Antonio Motti',
  'Conder Kyl',
  'Constable Zuvio',
  'Cordé',
  'Cpatain Typho',
  'Crix Madine',
  'Cut Lawquane',
  'Dak Ralter',
  'Dapp',
  'Darth Bane',
  'Darth Maul',
  'Darth Tyranus',
  'Daultay Dofine',
  'Del Meeko',
  'Delian Mors',
  'Dengar',
  'Depa Billaba',
  'Derek Klivian',
  'Dexter Jettster',
  'Dineé Ellberger',
  'DJ',
  'Doctor Aphra',
  'Doctor Evazan',
  'Dogma',
  'Dormé',
  'Dr. Cylo',
  'Droidbait',
  'Droopy McCool',
  'Dryden Vos',
  'Dud Bolt',
  'Ebe E. Endocott',
  'Echoy',
  'Eeth Koth',
  'Eighth Brother',
  'Eirtaé',
  'Eli Vanto',
  'Ellé',
  'Ello Asty',
  'Embo',
  'Eneb Ray',
  'Enfys Nest',
  'EV-9D9',
  'Evaan Verlaine',
  'Even Piell',
  'Ezra Bridger',
  'FN-2003',
  'Faro Argyus',
  'Fec',
  'Fenn Rau',
  'Feral',
  'Fifth Brother',
  'Finis Valorum',
  'Finn',
  'Fives',
  'FN-2199',
  'Fodesinbeed Annodue',
  'Fulcrum',
  'FX-7',
  'GA-97',
  'Galen Erso',
  'Garrick Versio',
  'Garven Dreis',
  'Gavyn Sykes',
  'Gideon Hask',
  'Gizor Dellso',
  'Gonk droid',
  'Grand Admiral Thrawn',
  'Grand Inquisitor',
  'Grand Moff Tarkin',
  'Greeata Jendowanian',
  'Greedo',
  'Greer Sonnel',
  'Grievous',
  'Grummgar',
  'Gungi',
  'Hammerhead',
  'Han Solo',
  'Hango',
  'Harter Kalonia',
  'Has Obbit',
  'Hera Syndulla',
  'Hevy',
  'Hondo Ohnaka',
  'Huyang',
  'Iden Versio',
  'IG-11',
  'IG-88',
  'Imperial Hovertank Pilot',
  'Inquisitors',
  'Inspector Thanoth',
  'Jabba',
  'Jacen Syndulla',
  'Jan Dodonna',
  'Jango Fett',
  'Jannah',
  'Jar Jar Binks',
  'Jas Emari',
  'Jaxxon',
  'Jek Tono Porkins',
  'Jeremoch Colton',
  'Jess Pava',
  'Jessika Pava',
  'Jira',
  'Jobal Naberrie',
  'Jocasta Nu',
  'Joclad Danva',
  'Joh Yowza',
  'Jom Barell',
  'Joph Seastriker',
  'Jova Tarkin',
  'Jubnuk',
  'Jyn Erso',
  'K-2SO',
  'Kanan Jarrus',
  'Karbin',
  'Karga',
  'Ki-Adi-Mundi',
  'King Katuunko',
  'Kister',
  'Kit Fisto',
  'Kitster Banai',
  'Klaatu',
  'Klik-Klak',
  'Knight of Ren',
  'Knox',
  'Korr Sella',
  'Kylo Ren',
  'L3-37',
  'Lama Su',
  'Lando Calrissian',
  'Lanever Villecham',
  'Leia Organa',
  'Lorth Needa',
  'Lott Dod',
  'Luke Skywalker',
  'Lumat',
  'Luminara Unduli',
  'Lusankya',
  'Lyn Erso',
  'Lyra Erso',
  'Mace Windu',
  'Malakili',
  'Mama the Hutt',
  'Mara Jade',
  'Max Rebo',
  'Maya Lahan',
  'Meena Tills',
  'Mercurial Swift',
  'Migs Mayfeld',
  'Mill Alibeth',
  'Miraj Scintel',
  'Moff Tiaan Jerjerrod',
  'Mon Mothma',
  'Moradmin Bast',
  'Moroff',
  'Mother Talzin',
  'Nahdar Vebb',
  'Nahdonnis Praji',
  'Nanta',
  'Nien Nunb',
  'Niima the Hutt',
  'Nines',
  'Norra Wexley',
  'Nute Gunray',
  'Nuvo Vindi',
  'Obi-Wan Kenobi',
  'Odd Ball',
  'Ohnaka',
  'Olkif',
  'Onaconda Farr',
  'Oola',
  'OOM-9',
  'Oppo Rancisis',
  'Orn Free Taa',
  'Oro Dassyne',
  'Orrimarko',
  'Osi Sobeck',
  'Owen Lars',
  'Pablo-Jill',
  'Padmé Amidala',
  'Pagetti Rook',
  'Paige Tico',
  'Paploo',
  'Petty Officer Thanisson',
  'Pharl McQuarrie',
  'Plo Koon',
  'Po Nudo',
  'Poe Dameron',
  'Poggle the Lesser',
  'Pong Krell',
  'Pooja Naberrie',
  'PZ-4CO',
  'Qi\'ra',
  'Quarrie',
  'Quay Tolsite',
  'Queen Jamillia',
  'Queen Neeyutnee',
  'Qui-Gon Jinn',
  'Quiggold',
  'R2-D2',
  'R3-S6',
  'R4-P17',
  'R5-D4',
  'RA-7',
  'Rabé',
  'Raddus',
  'Ragnar',
  'Rahm Kota',
  'Rakata',
  'Ransolm Casterfo',
  'Rappertunie',
  'Ratts Tyerell',
  'Raymus Antilles',
  'Ree-Yees',
  'Reeva Demesne',
  'Rey',
  'Ric Olié',
  'Riff Tamson',
  'Riley',
  'Rinnriyin Di',
  'Rio Durant',
  'Rogue Squadron',
  'Romba',
  'Roo-Roo Page',
  'Rose Tico',
  'Rotta the Hutt',
  'Rukh',
  'Rune Haako',
  'Ryder Azadi',
  'Rycus Kilran',
  'Rystáll Sant',
  'Sabé',
  'Sabine Wren',
  'Saché',
  'Saelt-Marae',
  'Saesee Tiin',
  'Salacious Crumb',
  'San Hill',
  'Sana Starros',
  'Sarco Plank',
  'Sarkli',
  'Savage Opress',
  'Sebulba',
  'Senator Organa',
  'Sergeant Kreel',
  'Seventh Sister',
  'Shaak Ti',
  'Shara Bey',
  'Shmi Skywalker',
  'Shu Mai',
  'Sidon Ithano',
  'Sifo-Dyas',
  'Sim Aloo',
  'Siniir Rath Velus',
  'Sio Bibble',
  'Sixth Brother',
  'Slowen Lo',
  'Sly Moore',
  'Snap Wexley',
  'Snoke',
  'Sola Naberrie',
  'Sora Bulq',
  'Strono Tuggs',
  'Sy Snootles',
  'Tallissan Lintra',
  'Tarfful',
  'Tasu Leech',
  'Taun We',
  'Techno Union',
  'Teebo',
  'Teemto Pagalies',
  'Temiri Blagg',
  'Tessek',
  'Tey How',
  'Thane Kyrell',
  'The Bendu',
  'The Sarlacc',
  'Thrass',
  'Tiaan Jerjerrod',
  'Tion Medon',
  'Tobias Beckett',
  'Tol Skorr',
  'Toma',
  'Toonbuck Toora',
  'Toro Calican',
  'TriPodRace',
  'Tseebo',
  'TK-421',
  'TK-462',
  'TN-3492',
  'TO-B1',
  'Unkar Plutt',
  'Val Beckett',
  'Valen Rudor',
  'Valorum',
  'Vanee',
  'Vaneé',
  'Ventress',
  'Vober Dand',
  'VR-34',
  'Vultren Swift',
  'Vyak',
  'Wag Too',
  'Wald',
  'Walrus Man',
  'Warok',
  'Wat Tambor',
  'Watto',
  'Wed Antilles',
  'Wedge Antilles',
  'Wicket',
  'Wilhuff Tarkin',
  'Wollivan',
  'Wuher',
  'Wullf Yularen',
  'Xamuel Lennox',
  'Yaddle',
  'Yarael Poof',
  'Yoda',
  'Zam Wesell',
  'Zeb Orrelios',
  'Zev Senesca',
  'Ziro the Hutt',
  'Zuvio',
];

function useMentionLookupService(mentionString) {
  const [results, setResults] = useState([]);

  React.useEffect(() => {
    if (!mentionString) {
      setResults([]);
      return;
    }

    const cachedResults = mentionsCache.get(mentionString);

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    
    // Simulate API delay
    setTimeout(() => {
      const filteredResults = dummyMentionsData
        .filter((mention) =>
          mention.toLowerCase().includes(mentionString.toLowerCase()),
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT);
      
      mentionsCache.set(mentionString, filteredResults);
      setResults(filteredResults);
    }, 500);
  }, [mentionString]);

  return results;
}

function checkForAtSignMentions(text, minMatchLength) {
  let match = AtSignMentionsRegex.exec(text);

  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text) {
  return checkForAtSignMentions(text, 1);
}

class MentionTypeaheadOption extends MenuOption {
  name;
  picture;

  constructor(name, picture) {
    super(name);
    this.name = name;
    this.picture = picture;
  }
}

function MentionTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}>
      {option.picture && (
        <div className="icon">
          <img src={option.picture} alt={option.name} />
        </div>
      )}
      <span className="text">{option.name}</span>
    </li>
  );
}

export default function MentionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState(null);
  
  const results = useMentionLookupService(queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results
        .map(
          (result) =>
            new MentionTypeaheadOption(result, `/images/mentions/${result}.png`),
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const onSelectOption = useCallback(
    (selectedOption, nodeToRemove, closeMenu, matchingString) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || selectedOption == null) {
          return;
        }

        if (nodeToRemove) {
          nodeToRemove.remove();
        }

        const mentionNode = $createMentionNode(selectedOption.name);

        selection.insertNodes([mentionNode]);

        // Add space after mention
        const spaceNode = $createTextNode(' ');
        selection.insertNodes([spaceNode]);
      });

      closeMenu();
    },
    [editor],
  );

  const checkForMentionMatch = useCallback((text) => {
    return getPossibleQueryMatch(text);
  }, []);

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        {selectedIndex, selectOptionAndCleanUp, setHighlightedIndex},
      ) =>
        anchorElementRef.current && options.length
          ? createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {options.map((option, i) => (
                    <MentionTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
