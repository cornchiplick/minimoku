const HiaraKataPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold">히라가나 / 카타카나 표</h2>

      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold">히라가나 (ひらがな)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border px-4 py-2"></th>
                <th className="border px-4 py-2">あ (a)</th>
                <th className="border px-4 py-2">い (i)</th>
                <th className="border px-4 py-2">う (u)</th>
                <th className="border px-4 py-2">え (e)</th>
                <th className="border px-4 py-2">お (o)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-bold">(없음)</td>
                <td className="border px-4 py-2">あ a</td>
                <td className="border px-4 py-2">い i</td>
                <td className="border px-4 py-2">う u</td>
                <td className="border px-4 py-2">え e</td>
                <td className="border px-4 py-2">お o</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">k</td>
                <td className="border px-4 py-2">か ka</td>
                <td className="border px-4 py-2">き ki</td>
                <td className="border px-4 py-2">く ku</td>
                <td className="border px-4 py-2">け ke</td>
                <td className="border px-4 py-2">こ ko</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">s</td>
                <td className="border px-4 py-2">さ sa</td>
                <td className="border px-4 py-2">し shi</td>
                <td className="border px-4 py-2">す su</td>
                <td className="border px-4 py-2">せ se</td>
                <td className="border px-4 py-2">そ so</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">t</td>
                <td className="border px-4 py-2">た ta</td>
                <td className="border px-4 py-2">ち chi</td>
                <td className="border px-4 py-2">つ tsu</td>
                <td className="border px-4 py-2">て te</td>
                <td className="border px-4 py-2">と to</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">n</td>
                <td className="border px-4 py-2">な na</td>
                <td className="border px-4 py-2">に ni</td>
                <td className="border px-4 py-2">ぬ nu</td>
                <td className="border px-4 py-2">ね ne</td>
                <td className="border px-4 py-2">の no</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-600">* 일부만 표시됨</p>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold">카타카나 (カタカナ)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border px-4 py-2"></th>
                <th className="border px-4 py-2">ア (a)</th>
                <th className="border px-4 py-2">イ (i)</th>
                <th className="border px-4 py-2">ウ (u)</th>
                <th className="border px-4 py-2">エ (e)</th>
                <th className="border px-4 py-2">オ (o)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-bold">(없음)</td>
                <td className="border px-4 py-2">ア a</td>
                <td className="border px-4 py-2">イ i</td>
                <td className="border px-4 py-2">ウ u</td>
                <td className="border px-4 py-2">エ e</td>
                <td className="border px-4 py-2">オ o</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">k</td>
                <td className="border px-4 py-2">カ ka</td>
                <td className="border px-4 py-2">キ ki</td>
                <td className="border px-4 py-2">ク ku</td>
                <td className="border px-4 py-2">ケ ke</td>
                <td className="border px-4 py-2">コ ko</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">s</td>
                <td className="border px-4 py-2">サ sa</td>
                <td className="border px-4 py-2">シ shi</td>
                <td className="border px-4 py-2">ス su</td>
                <td className="border px-4 py-2">セ se</td>
                <td className="border px-4 py-2">ソ so</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">t</td>
                <td className="border px-4 py-2">タ ta</td>
                <td className="border px-4 py-2">チ chi</td>
                <td className="border px-4 py-2">ツ tsu</td>
                <td className="border px-4 py-2">テ te</td>
                <td className="border px-4 py-2">ト to</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">n</td>
                <td className="border px-4 py-2">ナ na</td>
                <td className="border px-4 py-2">ニ ni</td>
                <td className="border px-4 py-2">ヌ nu</td>
                <td className="border px-4 py-2">ネ ne</td>
                <td className="border px-4 py-2">ノ no</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-600">* 일부만 표시됨</p>
      </div>
    </div>
  );
};

export default HiaraKataPage;
