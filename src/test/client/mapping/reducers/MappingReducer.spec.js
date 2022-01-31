import {
    allMappingNames,
    allTables,
    currentMapping,
    mappingConfig,
    mappingJson,
    selectedEnrollmentsTable,
    selectedEventTable,
    selectedEventTableColumns,
    selectedInstanceTable,
    selectedInstanceTableColumns
} from '../../../../main/client/mapping/reducers/MappingReducer';

describe('#mappingReducers', () => {
    let action,
        state;

    describe('allTables', () => {
        beforeEach(() => {
            action = {
                type: 'allTables',
                allTables: []
            };
        });

        it('should return state when "action.type" is anything other than "allTables"', () => {
            state = ['someValue'];
            expect(allTables(state)).toEqual(['someValue']);
        });

        it('should return action.allTables when "action.type" is allTables', () => {
            action.allTables = ['patient_identifier', 'tb-service'];
            expect(allTables(state, action)).toEqual(['patient_identifier', 'tb-service']);
        });

        it('should return action.allTables when "action.type" is allTables', () => {
            action.allTables = ['patient_identifier', 'tb-service'];
            expect(allTables(state, action)).toEqual(['patient_identifier', 'tb-service']);
        });

        it('should return state when "action.type" is anything other than "allTables"', () => {
            expect(allTables()).toEqual([]);
        });
    });


    describe('selectedInstanceTable', () => {
        beforeEach(() => {
            action = {
                type: 'selectedInstanceTable',
                selectedInstanceTable: ''
            };
        });

        it('should return state when "action.type" is anything other than "selectedInstanceTable"', () => {
            state = 'someValue';
            expect(selectedInstanceTable(state)).toEqual('someValue');
        });

        it('should return action.selectedInstanceTable when "action.type" is selectedInstanceTable', () => {
            action.selectedInstanceTable = 'patient_identifier';
            expect(selectedInstanceTable(state, action)).toEqual('patient_identifier');
        });

        it('should return state when "action.type" is anything other than "selectedInstanceTable"', () => {
            expect(selectedInstanceTable()).toEqual('');
        });
    });

    describe('selectedEnrollmentsTable', () => {
        beforeEach(() => {
            action = {
                type: 'selectedEnrollmentsTable',
                selectedEnrollmentsTable: ''
            };
        });

        it('should return state when "action.type" is anything other than "selectedEnrollmentsTable"', () => {
            state = 'someValue';
            expect(selectedEnrollmentsTable(state)).toEqual('someValue');
        });

        it('should return action.selectedEnrollmentsTable when "action.type" is selectedEnrollmentsTable', () => {
            action.selectedEnrollmentsTable = 'patient_identifier';
            expect(selectedEnrollmentsTable(state, action)).toEqual('patient_identifier');
        });

        it('should return state when "action.type" is anything other than "selectedEnrollmentsTable"', () => {
            expect(selectedEnrollmentsTable()).toEqual('');
        });
    });

    describe('selectedEventTable', () => {
        beforeEach(() => {
            action = {
                type: 'selectedEventTable',
                selectedEventTable: ''
            };
        });

        it('should return state when "action.type" is anything other than "selectedEventTable"', () => {
            state = 'someValue';
            expect(selectedEventTable(state)).toEqual('someValue');
        });

        it('should return action.selectedEventTable when "action.type" is selectedEventTable', () => {
            action.selectedEventTable = "patient_identifier";
            expect(selectedEventTable(state, action)).toEqual("patient_identifier");
        });

        it('should return empty when args are default', () => {
            expect(selectedEnrollmentsTable()).toEqual("");
        });
    });

    describe('selectedInstanceTableColumns', () => {
        beforeEach(() => {
            action = {
                type: 'selectedInstanceTableColumns',
                selectedInstanceTableColumns: []
            };
        });

        it('should return state when "action.type" is anything other than "selectedInstanceTableColumns"', () => {
            state = ['someValue'];
            expect(selectedInstanceTableColumns(state)).toEqual(['someValue']);
        });

        it('should return action.selectedInstanceTableColumns when "action.type" is selectedInstanceTableColumns', () => {
            action.selectedInstanceTableColumns = ['patient_identifier', 'tb-service'];
            expect(selectedInstanceTableColumns(state, action)).toEqual(['patient_identifier', 'tb-service']);
        });

        it('should return state when "action.type" is anything other than "selectedInstanceTableColumns"', () => {
            expect(selectedInstanceTableColumns()).toEqual([]);
        });
    });

    describe('selectedEventTableColumns', () => {
        beforeEach(() => {
            action = {
                type: 'selectedEventTableColumns',
                selectedEventTableColumns: []
            };
        });

        it('should return state when "action.type" is anything other than "selectedEventTableColumns"', () => {
            state = ['someValue'];
            expect(selectedEventTableColumns(state)).toEqual(['someValue']);
        });

        it('should return action.selectedEventTableColumns when "action.type" is selectedEventTableColumns', () => {
            action.selectedEventTableColumns = ['patient_identifier', 'tb-service'];
            expect(selectedEventTableColumns(state, action)).toEqual(['patient_identifier', 'tb-service']);
        });

        it('should return empty array on default"', () => {
            expect(selectedEventTableColumns()).toEqual([]);
        });
    });

    describe('allMappingNames', () => {
        beforeEach(() => {
            action = {
                type: 'allMappings',
                allMappings: []
            };
        });

        it('should return state when "action.type" is anything other than "renderedMappingNames"', () => {
            state = ['someValue'];
            expect(allMappingNames(state)).toEqual(['someValue']);
        });

        it('should return action.renderedMappingNames when "action.type" is renderedMappingNames', () => {
            action.allMappings = ['patient_identifier', 'tb-service'];
            expect(allMappingNames(state, action)).toEqual(['patient_identifier', 'tb-service']);
        });

        it('should return state when "action.type" is anything other than "renderedMappingNames"', () => {
            expect(allMappingNames()).toEqual([]);
        });

        it('should add new mapping name to the existing list', () => {
           let action = {
               type: 'addNewMapping',
               mappingName: "new mapping"
           };

           expect(allMappingNames([ "first name", "second name" ], action))
               .toEqual([ "first name", "second name", "new mapping" ]);
        });
    });

    describe('currentMapping', () => {
        it('should return state with default params', () => {
            expect(currentMapping()).toEqual("");
        });

        it('should return state when "action.type" is anything other than "currentMapping"', () => {
            state = "HTS Service";
            expect(currentMapping(state)).toEqual(state);
        });

        it('should return action.currentMapping when "action.type" is currentMapping', () => {
            let action = {
                type : "currentMapping",
                mappingName : "HTS Service"
            };
            expect(currentMapping("", action)).toEqual("HTS Service");
        });
    });

    describe('mappingJson', () => {
        it('should return state with default params', () => {
            expect(mappingJson()).toEqual({instance: {}, enrollments: {}, event: {}});
        });

        it('should return state when "action.type" is anything other than "mappingJson"', () => {
            state = {
                "instance": {"pat_id" : "patHn67"},
                "enrollments": {"pat_id": "pafsr3"},
                "event": {"event_id": "fdkf23"}
            };
            expect(mappingJson(state)).toEqual(state);
        });

        it('should return action.mappingJson when "action.type" is mappingJson', () => {
            let action = {
                type : "mappingJson",
                mappingJson : {
                    "instance": {"pro_id" : "ASG67J", "rpo_name" : "9Yu6TR" },
                    "enrollments": {"pat_id": "pafsr3"},
                    "event": {"event_id": "fdkf23"}
                }
            };
            expect(mappingJson({}, action)).toEqual(action.mappingJson);
        });
    });

    describe('mappingConfig', () => {
        it('should return state with default params', () => {
            expect({searchable:[], comparable: [], openLatestCompletedEnrollment: ""}).toEqual(mappingConfig());
        });

        it('should return state when "action.type" is anything other than "mappingConfig"', () => {
            state = {
                searchable: ["patient_id", "phtc"],
                comparable: ["Date_of_birth"],
                openLatestCompletedEnrollment: ""
            };
            expect(state).toEqual(mappingConfig(state));
        });

        it('should return action.mappingConfig when "action.type" is mappingJson', () => {
            let action = {
                type: "mappingConfig",
                mappingConfig: {
                    searchable: ["patient_id"],
                    comparable: ["First_name"],
                    openLatestCompletedEnrollment: ""
                }
            };
            expect(mappingConfig({}, action)).toEqual(action.mappingConfig);
        });
    });
});
