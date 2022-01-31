import {render, configure} from 'enzyme';
import React from "react";
import Adapter from "enzyme-adapter-react-16/build/index";
import {createStore} from "redux";
import Preview from "../../../../main/client/sync/components/Preview";

configure({adapter: new Adapter()})

describe('Preview', function () {
    let rendered, store;

    function renderPreview(store) {
        return render(
          <Preview
            store={store}
            serviceName="HTS Service"
            match={{
                    params: {
                        service: "HTS Service"
                    }
                }}
          />
        );
    }

    describe('#NoDeltaData', function () {

        beforeEach(() => {
            store = createStore(() => ({
                dispatch: () => {
                }
            }));
            rendered = renderPreview(store);
        });

        it('should not contain service name', function () {
            expect(rendered.find('.service-name')).toHaveLength(0);
        });

        it('should not contain time', function () {
            expect(rendered.find('.time-stamp')).toHaveLength(0);
        });

        it('should not contain table of data to sync', function () {
            expect(rendered.find('.delta-data')).toHaveLength(0);
        });
    });
});