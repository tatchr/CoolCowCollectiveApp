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
    lastweek = 'last week',
    last2weeks = 'last 2 weeks',
    lastmonth = 'last month',
    lastquarter = 'last quarter',
    lastyear = 'last year',
    alltime = 'all time'
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