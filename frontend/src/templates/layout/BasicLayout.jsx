import './BasicLayout.scss';

const BasicLayout = ({ children }) => {
  return (
    <div className='externalBasicLayout'>
      <div className='basicLayout'>
        {children}
      </div>
    </div>
  );
};

export default BasicLayout;
