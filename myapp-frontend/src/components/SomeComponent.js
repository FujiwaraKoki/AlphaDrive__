import React, { useState } from 'react';
import axios from 'axios';

function SomeComponent() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = () => {
        axios.get('http://localhost:8000/api/CustomUser/')
            .then(response => {
                console.log(response.data);
                setData(response.data);  // 成功したらデータをセット
                setError(null);  // エラーをクリア
            })
            .catch(error => {
                console.error('There was an error!', error);
                setError('An error occurred!');  // エラーメッセージをセット
            });
    };

    return (
        <div>
            <button onClick={fetchData}>Fetch Data</button>
            {error && <p>{error}</p>}  {/* エラーがあれば表示 */}
            {data.map(item => (
                // コメントを削除または別の場所に移動
                <p key={item.id}>{JSON.stringify(item)}</p>
            ))}
        </div>
    );
}

export default SomeComponent;
