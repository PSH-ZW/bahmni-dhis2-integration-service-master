import 'jsdom-global/register';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Spinner from "../../../main/client/common/Spinner";

configure({ adapter: new Adapter() });

describe('Spinner Component', () => {
    it('should render spinner', () => {
        const wrapper = mount(
          <Spinner hide={false} />
        );
        expect(wrapper.find('div')).toHaveLength(1);
    });

    it('should not render spinner', () => {
        const wrapper = mount(
          <Spinner hide />
        );
        expect(wrapper.find('div')).toHaveLength(0);
    });
});
