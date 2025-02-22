


export const getAddedMinutesParsedValue = (min) => {
    let currentDate = new Date();
    let newDate = new Date(
      currentDate.setMinutes(currentDate.getMinutes() + min)
    );
    return Date.parse(newDate.toString());
  };

  export const isNullOrEmpty = (value) => {
    if (value === null || value === undefined || value === "") return true;
  
    return false;
  };