
/**
 * A method to parse large plaintext notes field from item documment
 * @param {the raw notes from database with alternating notes/date} notes 
 * @returns an array with even index being note content and odd index being date for note
 */
export default function MapNotes (notes) {
    let notesArray      = [];
    let notesSplitArray = [];
        notesSplitArray = notes.split('`');
    let notesObject     = {
            notes   : '',
            date    : ''
    };
    for(let i = 0; i < notesSplitArray.length; i++) {
        if(notesSplitArray[i] !== "") {
            if(i % 2 === 0 || i === 0) {
                notesObject.notes = notesSplitArray[i];
            } else {
                notesObject.date = notesSplitArray[i];
                notesArray.push(notesObject);
                notesObject = {
                    notes   : '',
                    date    : ''
                }
            }
        }
    }
    return notesArray;
}