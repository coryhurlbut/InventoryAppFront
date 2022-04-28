export default function MapNotes (notes) {
    let notesArray = [];
    let notesSplitArray = [];
        notesSplitArray = notes.split('`');
    let notesObject = {
            notes: '',
            date: ''
    };
    for(let i = 0; i < notesSplitArray.length; i++) {
        if(notesSplitArray[i] !== "") {
            if(i % 2 === 0 || i === 0) {
                notesObject.notes = notesSplitArray[i];
            } else {
                notesObject.date = notesSplitArray[i];
                notesArray.push(notesObject);
                notesObject = {
                    notes: '',
                    date: ''
                }
            }
        }
    }
    return notesArray;
}