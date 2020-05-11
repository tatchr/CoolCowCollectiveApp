export enum Animal {
    Calf = 'Calf',
    Cow = 'Cow',
    Bull = 'Bull',
    Heifer = 'Heifer'
};

export enum CowState {
    InHerd = 'InHerd',
    Sold = 'Sold',
    Deceased = 'Deceased',
    Deleted = 'Deleted' 
};

export enum CowStatus {
    Lactating = 'Lactating',
    NonLactating = 'Non-Lactating',
    NA = 'N/A'
};

export enum ItemSold {
    Cow = 'Cow',
    Heifer = 'Heifer',
    Calf = 'Calf',
    Bull = 'Bull',
    Sperm = 'Sperm',
    Other = 'Other'
};

export enum Period {
    lastweek = 'lastweek',
    last2weeks = 'last2weeks',
    lastmonth = 'lastmonth',
    lastquarter = 'lastquarter',
    lastyear = 'lastyear',
    alltime = 'alltime'
};

export enum TimeOfDay {
    Morning = 'Morning',
    Afternoon = 'Afternoon',
    Evening = 'Evening'
};

export enum ExpenseType{
    Feed ="Feed",
    Medicine ="Medicine",
    Labour ="Labour",
    Livestock ="Livestock",
    Other ="Other"
}