import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskDetailPage from './pages/TaskDetailPage';
import InfoPage from './pages/InfoPage';
import TaskList from './pages/TasksPage';
import AuthPage from './pages/auth/AuthPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth } from './store/slices/authSlice';
import { Layout } from 'antd';
import HeaderTemplate from './pages/template/HeaderTemplate';
import SiderTemplate from './pages/template/SiderTemplate';
import FooterTemplate from './pages/template/FooterTemplate';
import Error404 from './pages/404Page';
import { getStatuses } from './store/slices/taskSlice';

const { Content } = Layout;

const App = () => {

  const dispatch = useDispatch();
  const { isAuth, group } = useSelector(state => state.auth);
  //console.log('console', isAuth, group);

  useEffect(() => {
    //checkAuth && redirect('/');
    const access_token = localStorage.getItem('u-access');
    if (access_token) {
      //dispatch(actionCheckAuth(access_token));
      dispatch(fetchAuth(access_token));
      if (group && group === 1) {
        dispatch(getStatuses());
      }
    }
  }, [isAuth]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isAuth ?
        <>
          <SiderTemplate group={group} />
          <Layout>
            <HeaderTemplate />

            <Content
              style={{
                margin: '24px 16px 0',
              }}
              className="content_block"
            >
              <div
                className="site-layout-background"
                style={{
                  padding: 24,
                  minHeight: 360,
                }}
              >
                <Routes>
                  <Route path='*' element={< Error404 />} />
                  <Route path='/' element={<TaskList />} />
                  <Route path='/task/:id' element={<TaskDetailPage />} />
                  <Route path='/info' element={<InfoPage />} />
                  <Route path='/users' element={<UsersPage />} />
                  <Route path='/settings' element={<SettingsPage />} />
                  {/*<Route path='/addTask' element={<AddTask />} />
                  <Route path='/product/edit/:id' element={<EditProduct />} />
                  <Route path='/task/edit/:id' element={<EditTask />} />*/}

                  {/*<Route path='/product/:id' element={<ProductDetail />} />
                  <Route path='/auth' element={<AuthPage />} />*/}
                </Routes>
              </div>
            </Content>


            <FooterTemplate />
          </Layout>
        </>
        : <AuthPage />}
    </Layout >
  )
}

export default App
