import * as React from 'react';
import MasterLayout, { IMasterLayoutProps, MasterLayoutHeader, MasterLayoutContent, MasterLayoutNavbar } from '../base/scripts/master/layout'
import { Menu, Icon, Popup } from 'semantic-ui-react';
import { NavLink, Route } from 'react-router-dom';

import Item1Header from "./item1/header";
import Item1Content from "./item1/content";
import Item2Header from "./item2/header";
import Item2Content from "./item2/content";

export default (props: IMasterLayoutProps) => (
    <MasterLayout {...props}>
        <MasterLayoutNavbar>
            <Menu.Menu>
                <Menu.Item as={NavLink} to='/item1' name='item1'><span className='mbb-menu-item1'><Icon name='help circle'/>Item1</span><span className='mbb-menu-item2'><Popup trigger={<Icon name='help circle'/>} content='Item1' position='right center' inverted/></span></Menu.Item>
                <Menu.Item as={NavLink} to='/item2' name='item2'><span className='mbb-menu-item1'><Icon name='info'/>Item2</span><span className='mbb-menu-item2'><Popup trigger={<Icon name='info'/>} content='Item2' position='right center' inverted/></span></Menu.Item>
            </Menu.Menu>
        </MasterLayoutNavbar>
        <MasterLayoutHeader>
            <Route path='/item1' component={Item1Header} />
            <Route path='/item2' component={Item2Header} />
        </MasterLayoutHeader>
        <MasterLayoutContent>
            <Route path='/item1' component={Item1Content} />
            <Route path='/item2' component={Item2Content} />
        </MasterLayoutContent>
    </MasterLayout>
);