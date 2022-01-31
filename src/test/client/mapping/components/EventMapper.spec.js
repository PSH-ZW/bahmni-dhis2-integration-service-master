import 'jsdom-global/register';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import {configure, render} from 'enzyme';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import EventMapper from "../../../../main/client/mapping/components/EventMapper";

configure({adapter: new Adapter()});

describe('EventMapper', function () {
    let rendered;
    let store;

    beforeEach(() => {
        store = createStore(() => ({
            selectedEventTable: "patient_details",
            allTables:[],
            selectedEventTableColumns: [],
            mappingJson: {
                instance:{},
                enrollment:{},
                event: {}
            }
        }), applyMiddleware(thunkMiddleware));

        rendered = render(
          <Provider store={store}>
            <EventMapper />
          </Provider>
        );
    });


    it('should render ColumnMapping component when selectedEventTable have value', () => {
        expect(rendered.find('.mapping-table-div')).toHaveLength(1);
    });

    it('should render DisplayTableNames', () => {
        expect(rendered.find('.tables-list')).toHaveLength(1);
    });

    it('should have an input box with class name table-input', ()=> {
        expect(rendered.find('.table-input')).toHaveLength(1);
    });
});